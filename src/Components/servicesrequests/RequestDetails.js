import React, { useState, useEffect, useRef } from 'react'
import { UncontrolledCarousel, Button, FormGroup,
    Form, Input, Modal, 
    ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './ServiceDetails.css'

const RequestDetails = props => {

    const [request, setRequest] = useState({photos: [], title: "", body: "", user: {}})
    const [items, setItems] = useState([])
    const [modal, setModal] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false)
    const [currentImage, setCurrentImage] = useState("")
    const selectedPhoto = useRef()
    const title = useRef()
    const body = useRef()
    const messageToSend = useRef()

    const toggle = () => {
        if (modal) {
            setCurrentImage("")
        }
        setModal(!modal)
    };

    const deleteRequest = () => {
        fetch(`http://localhost:8000/request/${props.requestId}`, {
                "method": "DELETE",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("Token")}`
                }
            })
            .then(() => props.history.push("/requests"))
    }
    
    const removePhoto = () => {
        let newItems = [...items]
        if (items.length > 1) { 
            newItems.splice(selectedPhoto.current.value, 1)
        }
        setItems(newItems)
    }

    const completeRequest = () => {
        fetch(`http://localhost:8000/request/${props.requestId}`, {
                "method": "PUT",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("Token")}`
                },
                "body": JSON.stringify({
                    body: request.body,
                    title: request.title,
                    is_completed: !request.is_completed,
                    photos: request.photos.map(photo => photo.photo_url)
                })
            })
            .then(response => response.json())
            .then(getRequest)
    }

    const editRequest = () => {
        let images = items.map(item => item.src)
        if (currentImage !== "") {
            images.push(currentImage)
        }
        fetch(`http://localhost:8000/request/${props.requestId}`, {
                "method": "PUT",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("Token")}`
                },
                "body": JSON.stringify({
                    body: body.current.value,
                    title: title.current.value,
                    is_completed: request.is_completed,
                    photos: images
                })
            })
            .then(response => response.json())
            .then(getRequest)
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

    const sendMessage = () => {
        let userId = parseInt(request.user.url.split("http://localhost:8000/user/")[1])
        let regex = new RegExp('\\S', 'gm')
        if (regex.test(messageToSend.current.value)) {
            fetch(`http://localhost:8000/conversation`, {
                "method": "POST",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("Token")}`
                },
                "body": JSON.stringify({
                    userId: userId,
                    message: messageToSend.current.value
                })
            })
            .then(() => {
                messageToSend.current.value = ""
            })
        }
    }

    const getRequest = () => {
        fetch(`http://localhost:8000/request/${props.requestId}`, {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("Token")}`
                }
            })
            .then(response => response.json())
            .then(response => {
                setRequest(response)
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

    useEffect(getRequest, [])


    return (
        <div>
            {isCurrentUser ? 
                <div id="service-modal">
                    <Form inline onSubmit={(e) => e.preventDefault()}>
                        <Button id="complete" color="primary" onClick={completeRequest}>{request.is_completed ? "Reopen Request" : "Complete Request"}</Button>
                        <Button color="secondary" onClick={toggle}>Edit Request</Button>
                        <Button id="delete" color="danger" onClick={deleteRequest}>Delete Request</Button>
                    </Form>
                    <Modal isOpen={modal} toggle={toggle} unmountOnClose={true}>
                        <ModalHeader toggle={toggle}>Add a new request</ModalHeader>
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
                            <Input innerRef={title} type="textarea" placeholder="Title" rows={1} defaultValue={request.title} />
                            <p></p>
                            <Input innerRef={body} type="textarea" placeholder="Description" rows={5} defaultValue={request.body} />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => {
                                toggle()
                                editRequest()
                                }}>Edit Request</Button>{' '}
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            : null}
            <div id="Title">
                <h1>{request.title}</h1>
                <h3>By {request.user.username}</h3>
            </div>
            <div id="Carousel">
                <UncontrolledCarousel  items={items} />
            </div>
            <div id="Description">
                <p>
                    {request.body}
                </p>
            </div>
            {isCurrentUser ? null : 
                <div id="Message-Provider">
                    <Input innerRef={messageToSend} id="Message" type="textarea"></Input>
                    <Button onClick={sendMessage}>Send Message</Button>
                </div>
            }
        </div>
    )
}


export default RequestDetails