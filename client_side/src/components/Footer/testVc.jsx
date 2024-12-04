import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="p-4 bg-white shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Our Weekly Design Meeting</h1>
          <p className="text-sm text-gray-500">03, April 2023</p>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-green-500 font-semibold">Attendee: 26</span>
          <span className="text-red-500 font-semibold">Absent: 20</span>
          <span className="text-gray-400">Recording</span>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow grid grid-cols-4 gap-4 p-4">
        {/* Video Section */}
        <section className="col-span-3 bg-white p-4 rounded-lg shadow">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-md flex items-center justify-center">
            <p>Main Video Here</p>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md">User</div>
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md">User</div>
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md">User</div>
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md">+18</div>
          </div>
        </section>

        {/* Chat Section */}
        <aside className="bg-white p-4 rounded-lg shadow flex flex-col">
          <h2 className="text-lg font-bold mb-4">Chat (10)</h2>
          <div className="flex-grow space-y-4">
            <p>
              <strong>Benny M. Landry:</strong> Hello Guys!
            </p>
            <p>
              <strong>Albert C. Roberts:</strong> You can start.
            </p>
          </div>
          <input
            type="text"
            placeholder="Type your message"
            className="border border-gray-300 rounded-md p-2"
          />
        </aside>
      </main>

      {/* Bottom Toolbar */}
      <footer className="p-4 bg-white shadow-md flex justify-between items-center">
        <button className="bg-red-500 text-white px-4 py-2 rounded-md">Leave</button>
        <div className="flex gap-4">
          <button className="bg-gray-200 p-2 rounded-full">Mic</button>
          <button className="bg-gray-200 p-2 rounded-full">Video</button>
          <button className="bg-gray-200 p-2 rounded-full">Share Screen</button>
        </div>
      </footer>
    </div>
  );
};

export default App;
