import React from 'react'
import RegisterFrom from '../components/RegisterFrom'
import { useNavigate,Link } from 'react-router'
const Register = () => {
  return (
    <>
    <main>
        <RegisterFrom />
        <p>Already have an account? <Link to={"/login"}>Login</Link></p>
    </main>
    
    </>
  )
}

export default Register