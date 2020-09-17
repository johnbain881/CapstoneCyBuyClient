import React, { useState, useEffect, useRef } from 'react'
import { UncontrolledCarousel, Button, FormGroup,
    Form, Input, Modal, 
    ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './ServiceDetails.css'

const ServiceDetails = props => {

    const [service, setService] = useState({photos: [], title: "", body: "", user: {}})
    const [items, setItems] = useState([])
    const [modal, setModal] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false)
    const [currentImage, setCurrentImage] = useState("")
    const selectedPhoto = useRef()
    const title = useRef()
    const body = useRef()

    const toggle = () => {
        if (modal) {
            setCurrentImage("")
        }
        setModal(!modal)
    };

    const deleteService = () => {
        fetch(`http://localhost:8000/service/${props.serviceId}`, {
                "method": "DELETE",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("Token")}`
                }
            })
            .then(() => props.history.push("/"))
    }
    
    const removePhoto = () => {
        let newItems = [...items]
        if (items.length > 1) { 
            newItems.splice(selectedPhoto.current.value, 1)
        }
        setItems(newItems)
    }

    const editService = () => {
        let images = items.map(item => item.src)
        if (currentImage !== "") {
            images.push(currentImage)
        }
        fetch(`http://localhost:8000/service/${props.serviceId}`, {
                "method": "PUT",
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
            .then(response => {
                getService()
            })
    }

    const getImage = (e) => {
        setCurrentImage(e.target.value)
    }

    const addAnotherPhoto = () => {
        let newImages = items
        if (currentImage !== "") {
            newImages.push({
                src: currentImage,
                altText: '',
                caption: '',
                header: '',
                key: newImages.length
              })
            setItems(newImages)
            setCurrentImage("")
        }
    }

    const getService = () => {
        fetch(`http://localhost:8000/service/${props.serviceId}`, {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("Token")}`
                }
            })
            .then(response => response.json())
            .then(response => {
                setService(response)
                fetch(`http://localhost:8000/user`, {
                        "method": "GET",
                        "headers": {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": `Token ${localStorage.getItem("Token")}`
                        }
                    })
                    .then(object => object.json())
                    .then(object => {
                        setIsCurrentUser(object.id === parseInt(response.user.url.split("http://localhost:8000/user/")[1]))
                    })
                setItems(response.photos.map((photo, index) => {
                    return {
                            src: photo.photo_url,
                            altText: '',
                            caption: '',
                            header: '',
                            key: index
                          }
                }))
            })
    }

    useEffect(getService, [])


    return (
        <div>
            {isCurrentUser ? 
                <div id="service-modal">
                    <Form inline onSubmit={(e) => e.preventDefault()}>
                        <Button color="primary" onClick={toggle}>Edit Service</Button>
                        <Button id="delete" color="danger" onClick={deleteService}>Delete Service</Button>
                    </Form>
                    <Modal isOpen={modal} toggle={toggle} unmountOnClose={true}>
                        <ModalHeader toggle={toggle}>Add a new service</ModalHeader>
                        <ModalBody>
                            <div className="photo-input-div">
                                <Input onChange={getImage} type="text" placeholder="Photo URL" defaultValue={currentImage} />
                                <Button onClick={addAnotherPhoto}>Add Another</Button>
                            </div>
                            <p></p>
                            <FormGroup>
                                <div className="photo-input-div">
                                    <Input innerRef={selectedPhoto} type="select" name="select" id="exampleSelect">
                                        {items.map((photo, index) => <option key={index + 1} value={index}>{photo.src}</option>)}
                                    </Input>
                                    <Button onClick={removePhoto}>Remove Photo</Button>
                                </div>
                            </FormGroup>
                            <p></p>
                            <Input innerRef={title} type="textarea" placeholder="Title" rows={1} defaultValue={service.title} />
                            <p></p>
                            <Input innerRef={body} type="textarea" placeholder="Description" rows={5} defaultValue={service.body} />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => {
                                toggle()
                                editService()
                                }}>Edit Service</Button>{' '}
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            : null}
            <div id="Title">
                <h1>{service.title}</h1>
                <h3>By {service.user.username}</h3>
            </div>
            <div id="Carousel">
                <UncontrolledCarousel  items={items} />
            </div>
            <div id="Description">
                <p>
                    {service.body}
                </p>
            </div>
        </div>
    )
}


export default ServiceDetails