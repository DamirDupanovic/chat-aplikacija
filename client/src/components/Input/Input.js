import React from 'react';

import './Input.css';

const Input = ({  setMessage, sendMessage}) => (
    <form className="form">
        <input
            className = 'input'
            type = 'text'
            placeholder = 'Poruka...'
            
            
            onKeyPress = {event => event.key === 'Enter' ? (setMessage(event.target.value),sendMessage(event)) : null}
        />
        <button className="sendButton" onClick = {(event) => {setMessage(event.target.value); sendMessage(event);}}>Send</button>
    </form>
)

export default Input;