import React, { useState, useRef, useEffect } from 'react'
import {
    Card, CardImg, CardBody,
    CardTitle, CardSubtitle, Button,
    Form, Input, Modal, 
    ModalHeader, ModalBody, ModalFooter,
    FormGroup
  } from 'reactstrap';
import './Services.css'

const Services = (props) => {
    
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const body = useRef()
    const title = useRef()
    const [currentImage, setCurrentImage] = useState("")
    const [images, setImages] = useState([])
    const photoToRemove = useRef()

    const [services, setServices] = useState([])

    useEffect(() => {
        getServices()
    }, [])


    const getServices = () => {
        fetch(`http://localhost:8000/service`, {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("Token")}`
                }
            })
            .then(response => response.json())
            .then(response => {
                setServices(response)
            })
    }

    const addService = () => {
        addAnotherPhoto()
        console.log(body.current.value, title.current.value, currentImage, images)
        if (body.current.value !== "" && title.current.value !== "" && images.length !== 0)
        fetch(`http://localhost:8000/service`, {
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
                getServices()
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
            <div></div>
            <div id="title">
                <h1>Services</h1>
            </div>
            <div id="service-modal">
                <Form inline onSubmit={(e) => e.preventDefault()}>
                    <Button color="primary" onClick={toggle}>Add New Service</Button>
                </Form>
                <Modal isOpen={modal} toggle={toggle} unmountOnClose={true}>
                    <ModalHeader toggle={toggle}>Add a new service</ModalHeader>
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
                            addService()
                            }}>Add Service</Button>{' '}
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
            <div id="services-cards">
                {services.map(service => {
                    return (
                    <Card key={service.id}>
                        <CardImg top width="100%" src={`${service.photos[0].photo_url}`} alt="Card image cap" />
                        <CardBody>
                            <CardTitle>{service.title}</CardTitle>
                            <CardSubtitle>By {service.user.username}</CardSubtitle>
                            <a href={`/${service.id}`} ><Button color="link">Details</Button></a>
                        </CardBody>
                    </Card>
                    )
                })}
            </div>
        </>
    )
}


export default Services