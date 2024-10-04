import React from 'react'
import SignIn from '../components/Signin'
import ScrollToTop from '../components/ScrollToTop'
import IDCardWithPDFDownload from './dashboard/components/IdCards'

const SignInPage = () => {
  return (
    <>
      <ScrollToTop/>
      <SignIn/>
    </>
  )
}

export default SignInPage