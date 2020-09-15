import React, { useRef, useState, useEffect } from 'react'
import { Input, Button } from 'reactstrap'
import './Login.css'

const Login = props => {
    const username = useRef()
    const password = useRef()
    const [isLoading, setIsLoading] = useState(true)
    const [userExists, setUserExists] = useState(true)

    const handleLogin = () => {
        setIsLoading(true)
        fetch(`http://localhost:8000/login/`, {
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            "body": JSON.stringify({
                username: username.current.value,
                password: password.current.value
            })
        })
        .then(response => response.json())
        .then(response => {
            if (response.valid) {
                localStorage.setItem("Token", response.token)
                props.history.push("/")
            } else {
                setUserExists(false)
                setIsLoading(false)
            }
        })
    }

    useEffect(() => {
        setIsLoading(false)
    }, [])

    return (
        <>
            <div id="loginDiv">
                <form id="login-form">
                    <h1 id="LoginTitle"><span id="Cy">Cy</span><span id="Buy">Buy</span></h1>
                    {!userExists ? <p>Incorrect username or password please try again</p> : null }
                    <Input innerRef={username} id="username" type="text" placeholder="Username"/>
                    <Input innerRef={password} id="password" type="password" placeholder="Password"/>
                <Button id="login-button" disabled={isLoading} onClick={handleLogin}>Login</Button>
                <a id="login-a" href="/register">Not a member? Sign up here!</a>
                </form>
            </div>
        </>
    )
}

export default Login