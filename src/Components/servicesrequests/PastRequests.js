import React, { useState, useEffect } from 'react'
import {
    Card, CardImg, CardBody,
    CardTitle, CardSubtitle, Button,
  } from 'reactstrap';
import './Services.css'

const PastRequests = props => {
    const [requests, setRequests] = useState([])
    const [user, setUser] = useState({})

    useEffect(() => {
        getRequests()
    }, [])


    const getRequests = () => {
        fetch(`http://localhost:8000/request?search=`, {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("Token")}`
                }
            })
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setRequests(response)
                fetch(`http://localhost:8000/user`, {
                        "method": "GET",
                        "headers": {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": `Token ${localStorage.getItem("Token")}`
                        }
                    })
                    .then(object => object.json())
                    .then(setUser)
            })
    }


    return (
        <>
            <div id="Title">
                <h1>Completed Requests</h1>
            </div>
            <div id="services-cards">
                {requests.map(request => {
                    return (request.is_completed && request.user.username === user.username ? 
                    <Card key={request.id}>
                        <CardImg top width="100%" src={`${request.photos[0].photo_url}`} alt="Card image cap" />
                        <CardBody>
                            <CardTitle>{request.title}</CardTitle>
                            <CardSubtitle>By {request.user.username}</CardSubtitle>
                            <a href={`/requests/${request.id}`} ><Button color="link">Details</Button></a>
                        </CardBody>
                    </Card>
                    : null)
                })}
            </div>
        </>
    )
}


export default PastRequests