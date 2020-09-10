import React, { useRef, useState, useEffect } from 'react'
import { Input, Label, Button } from 'reactstrap'
import './Login.css'

const Login = props => {
    const username = useRef()
    const password = useRef()
    const [isLoading, setIsLoading] = useState(true)

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
            console.log(response)
            if (response.valid) {
                localStorage.setItem("Token", response.token)
            } else {
                alert("Incorrect username or password")
            }
            setIsLoading(false)
        })
    }

    useEffect(() => {
        setIsLoading(false)
    }, [])

    return (
        <>
            <form>
                <Input innerRef={username} id="username" type="text"/>
                <Label for="username">Username</Label>
                <Input innerRef={password} id="password" type="password"/>
                <Label for="password">Password</Label>
                <Button disabled={isLoading} onClick={handleLogin}>Login</Button>
            </form>
        </>
    )
}

export default Login