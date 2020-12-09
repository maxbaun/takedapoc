import './App.css';
import Deform from './Deform';
import Deform2 from './Deform2';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Swap from './Swap';
import Track from './Track';
import PixiDemo from './PixiDemo';
import Faceapi from './Faceapi';
import Faceapi2 from './Faceapi2';

function App() {
  return (
    <Router>
      <Route component={Deform} path="/deform" />
      <Route component={Deform2} path="/deform2" />
      <Route component={Swap} path="/swap" />
      <Route component={Track} path="/track" />
      <Route component={PixiDemo} path="/pixi" />
      <Route component={Faceapi} path="/faceapi" />
      <Route component={Faceapi2} path="/faceapi2" />
    </Router>
  );
}

export default App;
