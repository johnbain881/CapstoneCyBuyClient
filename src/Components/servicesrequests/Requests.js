import React, { useState, useRef, useEffect } from 'react'
import {
    Card, CardImg, CardBody,
    CardTitle, CardSubtitle, Button,
    Form, Input, Modal, 
    ModalHeader, ModalBody, ModalFooter,
    FormGroup
  } from 'reactstrap';
import './Services.css'

const Requests = (props) => {
    
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const [search, setSearch] = useState("")
    const body = useRef()
    const title = useRef()
    const [currentImage, setCurrentImage] = useState("")
    const [images, setImages] = useState([])
    const photoToRemove = useRef()

    const [requests, setRequests] = useState([])

    useEffect(() => {
        getRequests()
    }, [search])


    const getRequests = () => {
        fetch(`http://localhost:8000/request?search=${search}`, {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("Token")}`
                }
            })
            .then(response => response.json())
            .then(response => {
                setRequests(response)
            })
    }

    const addRequest = () => {
        addAnotherPhoto()
        if (body.current.value !== "" && title.current.value !== "" && images.length !== 0)
        fetch(`http://localhost:8000/request`, {
                "method": "POST",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("Token")}`
                },
                "body": JSON.stringify({
                    body: body.current.value,
                    title: title.current.value,
                    photos: images
                })
            })
            .then(response => response.json())
            .then(() => {
                getRequests()
            })

        setImages([])
    }

    const addAnotherPhoto = () => {
        let newImages = images
        if (currentImage !== "") {
            newImages.push(currentImage)
            setImages(newImages)
            setCurrentImage("")
        }
    }

    const removePhoto = () => {
        let newImages = images
        newImages.splice(photoToRemove.current.value, 1)
        setImages(newImages)
    }

    const getImage = (e) => {
        setCurrentImage(e.target.value)
    }

    return (
        <>
        <div id="title-modal">
            <div id="search">
                <Input onChange={(e) => setSearch(e.target.value)} placeholder="Search"></Input>
            </div>
            <div id="title">
                <h1>Requests</h1>
            </div>
            <div id="service-modal">
                <Form inline onSubmit={(e) => e.preventDefault()}>
                    <Button color="primary" onClick={toggle}>Add New Request</Button>
                </Form>
                <Modal isOpen={modal} toggle={toggle} unmountOnClose={true}>
                    <ModalHeader toggle={toggle}>Add a new request</ModalHeader>
                    <ModalBody>
                        <div className="photo-input-div">
                            <Input onChange={getImage} type="text" placeholder="Photo URL" value={currentImage} />
                            <Button onClick={addAnotherPhoto}>Add Another</Button>
                        </div>
                        <p></p>
                        {images.length !== 0 ? 
                        <FormGroup className="photo-input-div">
                            <Input innerRef={photoToRemove} type="select" name="select" id="exampleSelect">
                            {images.map((image, index) => <option key={index + 1} value={index}>{image}</option>)}
                            </Input>
                            <Button onClick={removePhoto}>Remove Photo</Button>
                        </FormGroup>
                    : null}
                        <p></p>
                        <Input innerRef={title} type="textarea" placeholder="Title" rows={1} />
                        <p></p>
                        <Input innerRef={body} type="textarea" placeholder="Description" rows={5} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => {
                            toggle() 
                            addRequest()
                            }}>Add Request</Button>{' '}
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
            <div id="services-cards">
                {requests.map(request => {
                    return (request.is_completed ? null :
                    <Card key={request.id}>
                        <CardImg top width="100%" src={`${request.photos[0].photo_url}`} alt="Card image cap" />
                        <CardBody>
                            <CardTitle>{request.title}</CardTitle>
                            <CardSubtitle>By {request.user.username}</CardSubtitle>
                            <a href={`/requests/${request.id}`} ><Button color="link">Details</Button></a>
                        </CardBody>
                    </Card>
                    )
                })}
            </div>
        </>
    )
}


export default Requests