import React from 'react'
import Form from '../components/Form'
import { useNavigate,Link } from 'react-router'
const Login = () => {
  return (
    <>
    <main>
        <Form />
        <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
    </main>
    </>
  )
}

export default Login