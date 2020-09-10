import React from 'react'
import { Route } from 'react-router-dom';
import Login from './auth/Login';


const ApplicationViews = props => {



    return (
        <>
            <Route
                exact path="/" render={props => {
                    return <Login {...props} />
                }}
            />
        </>
    )
}


export default ApplicationViews