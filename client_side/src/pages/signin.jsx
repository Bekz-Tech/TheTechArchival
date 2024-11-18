import React from 'react'
import SignIn from '../components/Signin'
import ScrollToTop from '../components/ScrollToTop'
import useWebSocket from '../hooks/useWebocket'

const SignInPage = () => {


  return (
    <>
      <ScrollToTop/>
      <SignIn/>
    </>
  )
}

export default SignInPage