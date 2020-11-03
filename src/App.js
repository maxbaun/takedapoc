import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import Deform from './Deform';
import Deform2 from './Deform2';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Swap from './Swap';
import Track from './Track';

function App() {
  return (
    <Router>
      <Route component={Deform} path="/deform" />
      <Route component={Deform2} path="/deform2" />
      <Route component={Swap} path="/swap" />
      <Route component={Track} path="/track" />
    </Router>
  );
}

export default App;
