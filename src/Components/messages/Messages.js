import React, { useState, useEffect, useRef } from 'react'
import { ListGroup, ListGroupItem, Badge, Input, Button, Alert } from 'reactstrap';
import './Messages.css'


const Messages = props => {

    const [conversations, setConversations] = useState([{messages: [], user: {url: ""}}])
    const [currentUser, setCurrentUser] = useState({})
    const [currentConversation, setCurrentConversation] = useState(0)
    const messageToSend = useRef()


    const getConversations = () => {
        fetch(`http://localhost:8000/conversation`, {
                    "method": "GET",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Token ${localStorage.getItem("Token")}`
                    }
                })
                .then(response => response.json())
                .then(response => {
                    setConversations(response)
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
                        setCurrentUser(object)
                    })
                })
    }

    const sendMessage = () => {
        let userId = getCurrentConversationUserId()
        let regex = new RegExp('\\S', 'gm')
        if (regex.test(messageToSend.current.value) && currentConversation !== 0) {
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
                getConversations()
                messageToSend.current.value = ""
            })
        }
    }

    const getCurrentConversationUserId = () => {
        let userId = null
        conversations.forEach(conversation => {
            if (conversation.id === currentConversation) {
                userId = parseInt(conversation.user.url.split("http://localhost:8000/user/")[1]) === currentUser.id ? parseInt(conversation.other_user.url.split("http://localhost:8000/user/")[1]) : parseInt(conversation.user.url.split("http://localhost:8000/user/")[1])
            }
        })
        return userId
    }

    const getNumUnread = (messages) => {
        let numUnread = 0
        messages.forEach(message => message.read || parseInt(message.user.split("http://localhost:8000/user/")[1]) === currentUser.id ? null : numUnread++)
        return numUnread
    }

    const sendIfEnter = (e) => {
        if (e.key === "Enter") {
            sendMessage()
        }
    }

    useEffect(() => {
        getConversations()
        const interval = setInterval(() => {
            getConversations()
          }, 60000);
          return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        conversations.forEach(conversation => {
            if (currentConversation === conversation.id) {
                conversation.messages.forEach(message => {
                    if (!message.read && parseInt(message.user.split("http://localhost:8000/user/")[1]) !== currentUser.id) {
                        fetch(`http://localhost:8000/message/${message.id}`, {
                            "method": "PUT",
                            "headers": {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "Authorization": `Token ${localStorage.getItem("Token")}`
                            }
                        })
                        .then(getConversations)
                    }
                })
            }
        })
    }, [currentConversation, conversations, currentUser.id])

    return (
        <div id="Messages-Page">
            { conversations[0].messages.length !== 0 ?
            <>
                <div id="Conversations">
                    <h3 id="Conversations-Title">Conversations </h3>
                    <ListGroup>
                        {conversations.map(conversation => <ListGroupItem onClick={() => setCurrentConversation(conversation.id)} active={currentConversation === conversation.id ? true : false} key={conversation.id} tag="button" action>{parseInt(conversation.user.url.split("http://localhost:8000/user/")[1]) === currentUser.id ? conversation.other_user.username : conversation.user.username}    <Badge key={conversation.id} pill>{getNumUnread(conversation.messages) === 0 ? null : getNumUnread(conversation.messages)}</Badge></ListGroupItem>)}
                    </ListGroup>
                </div>
                <div id="Messages">
                    {conversations.map(conversation => conversation.id === currentConversation ? conversation.messages.map(message => <Alert key={message.id} color={parseInt(message.user.split("http://localhost:8000/user/")[1]) === currentUser.id ? "primary" : "secondary"} className={parseInt(message.user.split("http://localhost:8000/user/")[1]) === currentUser.id ? "right message" : "left message"}>{message.message}</Alert>): null)}
                    <div id="Anchor"></div>
                </div>
                <div id="Message-Form">
                    <Input onKeyPress={sendIfEnter} maxLength={1000} innerRef={messageToSend} type="textarea"></Input>
                    <Button id="Send-Message-Button" color="primary" onClick={sendMessage}>Send Message</Button>
                </div>
            </>
            : <h1 id="no-messages">You have no conversations</h1>}
        </div>
    )
}

export default Messages