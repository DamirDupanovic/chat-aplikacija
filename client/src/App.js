import React from 'react';

//redux 
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Join from './components/Join/Join.js';
import Chat from './components/Chat/Chat.js';

const App = () => (
    <Router>
        <Route path="/" exact component={Join} />
        <Route path="/chat" component={Chat} />
    </Router>
);

export default App;