import React, { useState, useEffect } from 'react'
import { UncontrolledCarousel, Button, FormGroup,
    Form, Input, Modal, 
    ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './ServiceDetails.css'

const ServiceDetails = props => {

    const [service, setService] = useState({photos: [], title: "", body: ""})
    const [items, setItems] = useState([])
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

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
                console.log(response)
                setItems(response.photos.map( (photo, index) => {
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

    useEffect(() => {
        getService()
    }, [])


    return (
        <div>
            <div id="service-modal">
                <Form inline onSubmit={(e) => e.preventDefault()}>
                    <Button color="primary" onClick={toggle}>Edit Service</Button>
                </Form>
                <Modal isOpen={modal} toggle={toggle} unmountOnClose={true}>
                    <ModalHeader toggle={toggle}>Add a new service</ModalHeader>
                    <ModalBody>
                        <div id="photo-input-div">
                            <Input onChange={console.log("")} type="text" placeholder="Photo URL"  />
                            <Button onClick={console.log("")}>Add Another</Button>
                        </div>
                        <p></p>
                        {true ? 
                        <FormGroup>
                            <Input type="select" name="select" id="exampleSelect">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            </Input>
                            <Button>Remove Photo</Button>
                        </FormGroup>
                    : null}
                        <p></p>
                        <Input  type="textarea" placeholder="Title" rows={1} />
                        <p></p>
                        <Input  type="textarea" placeholder="Description" rows={5} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => {
                            toggle() 
                            }}>Add Service</Button>{' '}
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
            <div id="Title">
                <h1>{service.title}</h1>
            </div>
            <div id="Carousel">
                <UncontrolledCarousel interval={false} items={items} />
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