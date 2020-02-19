//Koristen socket.io 
//useState == hooks setName direktno mjenja atribut name i refresuje komp.
//funkcija useEffect se pokrece kada se komponenta ucita i refresuje
//sa socket = io(url) -> "konektujemo" se na socket i salje socket na ENDPOINT
//socket.emit('join', {name, name}, ({ error }) {...} emituje join "zahtjev" koji ce obraditi 
//io na strani servera, parametre i funkciju za error handling
//socket.off() ugasi trenutnu instancu klijentskog soketa

import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

import './Chat.css';

let socket;

const Chat = ({location}) => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    //const ENDPOINT = 'https://pricalica.herokuapp.com/';
    const ENDPOINT = 'http://localhost:5000/';

    useEffect (() => {
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', {name, room}, (error) => {
            if(error){
                alert(error);
                window.location.href='/';
            }
        });
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        

        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [messages]);

    //funkcija za slanje poruka
    const sendMessage = (event) => {
        event.preventDefault();

        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    
    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room ={room}/>
                <Messages messages={messages} name={name}/>
                <Input  message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    );  
}

export default Chat;