import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import CyBuyNavBar from './navbar/NavBar';
import Services from './servicesrequests/Services';
import ServiceDetails from './servicesrequests/ServiceDetails';


const ApplicationViews = props => {

    const isLoggedIn = () => {
        return localStorage.getItem("Token") ? true : false
    }
    

    return (
        <>
            <Route
                exact path="/" render={props => {
                    return isLoggedIn() ? <><CyBuyNavBar {...props} /><Services /></> : <Login {...props} />
                }}
            />
            <Route
                exact path="/:serviceId(\d+)" render={props => {
                    return isLoggedIn() ? <><CyBuyNavBar {...props} /><ServiceDetails serviceId={parseInt(props.match.params.serviceId)} /></> : <Login {...props} />
                }}
            />
            <Route
                exact path="/register" render={props => {
                    return isLoggedIn() ? <Redirect to="/" /> : <Register {...props} />
                }}
            />
            <Route
                exact path="/requests" render={props => {
                    return isLoggedIn() ? <CyBuyNavBar {...props} /> : <Redirect to="/" />
                }}
            />
        </>
    )
}


export default ApplicationViews