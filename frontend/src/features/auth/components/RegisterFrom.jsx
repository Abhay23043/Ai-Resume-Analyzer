import React from 'react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js';
const RegisterFrom = () => {
    const { loading, handleRegister } = useAuth()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const handleSubmit = (e) => {
        e.preventDefault()
        handleRegister({ username, email, password })
    }

    if (loading) {
        return (
            <main>
                <h1>Loading...</h1>
            </main>
        )
    }
    return (
        <>
            <div className="form-container form-box">
                <h1>Register</h1>
                <form onSubmit={handleSubmit} >
                    <div id="input-group">
                        <label htmlFor='username'>Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="username" name="username" id="username" placeholder="Enter Your Username" required />

                    </div>
                    <div id="input-group">
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" name="email" id="email" placeholder="Enter Your Email" required />

                    </div>
                    <div id="input-group">
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" name="password" id="password" placeholder="Enter Your Password" required />

                    </div>

                    <button className="Primary-btn">Register</button>


                </form>
            </div>
        </>
    )
}

export default RegisterFrom