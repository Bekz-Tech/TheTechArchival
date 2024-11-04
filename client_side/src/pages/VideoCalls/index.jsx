import React, { useRef, useState, useEffect } from 'react';

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const wsRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [offerReceived, setOfferReceived] = useState(null); // Track the latest offer
  const [loading, setLoading] = useState(false); // Loading state for offer acceptance

  const servers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    const setupWebSocket = () => {
      wsRef.current = new WebSocket('ws://localhost:5000');

      wsRef.current.onmessage = handleSignalingMessage;

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        const uniqueClientId = `client-${Date.now()}`;
        setClientId(uniqueClientId);
        wsRef.current.send(JSON.stringify({ type: 'register', id: uniqueClientId }));
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        closeConnections();
      };
    };

    setupWebSocket();

    return () => {
      closeConnections();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSignalingMessage = async (event) => {
    const msg = JSON.parse(event.data);
    switch (msg.type) {
      case 'create-offer':
        console.log('Offer received from', msg.senderId);
        setOfferReceived({ offer: msg.offer, senderId: msg.senderId });
        break;
      case 'accept-offer':
        console.log('Answer received:', msg.answer);
        await handleAnswer(msg.answer);
        break;
      case 'ice-candidate':
        console.log('ICE candidate received:', msg.candidate);
        await handleNewICECandidate(msg.candidate);
        break;
      default:
        console.log('Unknown message type:', msg.type);
    }
  };

  const handleOffer = async (offer) => {
    const peerConnection = new RTCPeerConnection(servers);
    peerConnectionRef.current = peerConnection;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      setLocalStream(stream);

      peerConnection.ontrack = (event) => {
        console.log(event);
        console.log('remote stream set')
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log('Sending answer:', answer);
      wsRef.current.send(
        JSON.stringify({ type: 'accept-offer', answer, senderId: clientId })
      );

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
          wsRef.current.send(
            JSON.stringify({ type: 'ice-candidate', candidate: event.candidate, senderId: clientId })
          );
        }
      };

  
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (answer) => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;

    // Set the remote description to the received answer
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('Remote description set after receiving answer.');
  };

  const handleNewICECandidate = async (candidate) => {
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('ICE candidate added:', candidate);
      } catch (error) {
        console.error('Error adding received ICE candidate', error);
      }
    }
  };

  const createOffer = async () => {
    const peerConnection = new RTCPeerConnection(servers);
    peerConnectionRef.current = peerConnection;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      setLocalStream(stream);

      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log('Sending offer:', offer);
      wsRef.current.send(
        JSON.stringify({ type: 'create-offer', offer, senderId: clientId })
      );

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
          wsRef.current.send(
            JSON.stringify({ type: 'ice-candidate', candidate: event.candidate, senderId: clientId })
          );
        }
      };

      peerConnection.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const closeConnections = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  const acceptOffer = async () => {
    if (offerReceived) {
      setLoading(true);
      console.log('Accepting offer from:', offerReceived.senderId);
      await handleOffer(offerReceived.offer);
      setOfferReceived(null); // Reset after accepting
      setLoading(false);

    
    }
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }} />
      <div>
        <button onClick={createOffer}>Create Offer</button>
        <button onClick={closeConnections}>End Call</button>
      </div>
      {/* Only show the Accept Offer button if an offer is received */}
      {offerReceived && (
        <div>
          <p>Offer from {offerReceived.senderId}:</p>
          <button onClick={acceptOffer} disabled={loading}>
            {loading ? 'Accepting...' : 'Accept Offer'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
