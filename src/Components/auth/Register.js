import React, { useRef, useState, useEffect } from 'react'
import { Input, Button } from 'reactstrap'
import './Login.css'

const Register = props => {
    const username = useRef()
    const first = useRef()
    const last = useRef()
    const email = useRef()
    const password1 = useRef()
    const password2 = useRef()
    const [isLoading, setIsLoading] = useState(true)
    const [hasValue, setHasValue] = useState({
        username: true,
        first: true,
        last: true,
        email: true,
        password1: true,
        password2: true,
    })
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const [usernameIsTaken, setUsernameIsTaken] = useState(false)

    const handleFieldChange = (e) => {
        let newHasValue = {...hasValue}
        newHasValue[e.target.id] = !(e.target.value === "")
        if (e.target.id === "password1" || e.target.id === "password2") {
            setPasswordsMatch(password1.current.value === password2.current.value)
        }
        setHasValue(newHasValue)
    }

    const handleRegister = () => {
        setIsLoading(true)
        
        if (checkForm(updateHasValue()) && password1.current.value === password2.current.value){
            fetch(`http://localhost:8000/register/`, {
                "method": "POST",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                "body": JSON.stringify({
                    username: username.current.value,
                    password: password1.current.value,
                    first_name: first.current.value,
                    last_name: last.current.value,
                    email: email.current.value
                })
            })
            .then(response => {
                if (response.status === 500) {
                    setUsernameIsTaken(true)
                } else if (response.status === 200) {
                    return response.json()
                }
            })
            .then(response => {
                if (response) {
                    localStorage.setItem("Token", response.token)
                    props.history.push("/")
                }
            })
        }
        setIsLoading(false)
    }

    const updateHasValue = () => {
        let newHasValue = {
            username: !(username.current.value === ""),
            first: !(first.current.value === ""),
            last: !(last.current.value === ""),
            email: !(email.current.value === ""),
            password1: !(password1.current.value === ""),
            password2: !(password2.current.value === ""),
        }
        setHasValue(newHasValue)
        return newHasValue
    }

    const checkForm = (object) => {
        for(let key in object) {
            if (object[key] === false) {
                return false
            }
        }
        return true
    }

    useEffect(() => {
        setIsLoading(false)
    }, [])

    return (
        <>
            <div id="loginDiv">
                <form id="login-form">
                    <h1 id="LoginTitle"><span id="Cy">Cy</span><span id="Buy">Buy</span></h1>
                    <fieldset className="login-fieldset">
                        {hasValue.first ? null : <p>You must fill in this information</p>}
                        <Input id="first" onChange={handleFieldChange} innerRef={first} type="text" placeholder="First Name" className={hasValue.first ? "" : "red"}/>
                    </fieldset>
                    <fieldset className="login-fieldset">
                        {hasValue.last ? null : <p>You must fill in this information</p>}
                        <Input id="last" onChange={handleFieldChange} innerRef={last} type="text" placeholder="Last Name" className={hasValue.last ? "" : "red"}/>
                    </fieldset>
                    <fieldset className="login-fieldset">
                        {hasValue.email ? null : <p>You must fill in this information</p>}
                        <Input id="email" onChange={handleFieldChange} innerRef={email} type="email" placeholder="Email" className={hasValue.email ? "" : "red"}/>
                    </fieldset>
                    <fieldset className="login-fieldset">
                        {usernameIsTaken ? <p>This username has already been taken</p> : null}
                        {hasValue.username ? null : <p>You must fill in this information</p>}
                        <Input id="username" onChange={handleFieldChange} innerRef={username} type="text" placeholder="Username" className={hasValue.username ? "" : "red"}/>
                    </fieldset>
                    <fieldset className="login-fieldset">
                        {passwordsMatch ? null : <p>Your passwords do not match</p>}
                        {hasValue.password1 ? null : <p>You must fill in this information</p>}
                        <Input id="password1" onChange={handleFieldChange} innerRef={password1} type="password" placeholder="Password" className={hasValue.password1 && passwordsMatch ? "" : "red"}/>
                    </fieldset>
                    <fieldset className="login-fieldset">
                        {hasValue.password2 ? null : <p>You must fill in this information</p>}
                        <Input id="password2" onChange={handleFieldChange} innerRef={password2} type="password" placeholder="Password" className={hasValue.password2 && passwordsMatch ? "" : "red"}/>
                    </fieldset>
                    <fieldset className="login-fieldset">
                        <Button id="login-button" disabled={isLoading} onClick={handleRegister}>Register</Button>
                    </fieldset>
                </form>
            </div>
        </>
    )
}

export default Register