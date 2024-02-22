import './App.css';
import AppBar from './components/AppBar';
import Browse from './components/Browse';
import Chatview from './components/Chatview';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from "./components/Register"
import Error from "./components/Error"
import LoggedOut from './components/LoggedOut';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


// The structure of the App with react-router

function App() {

  return (
    <Router>
      <div className="App">
        <Routes> 
          <Route path="/" element={[<AppBar></AppBar>, <Register></Register>, <Login></Login>]}></Route>
          <Route path="/user/:id" element={[<AppBar></AppBar>, <Profile></Profile>]}> </Route>
          <Route path="/browse/:id" element={[<AppBar></AppBar>, <Browse></Browse>]}> </Route>
          <Route path="/chat/:id" element={[<AppBar></AppBar>, <Chatview></Chatview>]}></Route>
          <Route path="/error" element={[<AppBar></AppBar>, <Error></Error>]}></Route>
          <Route path="/logout" element={[<AppBar></AppBar>, <LoggedOut></LoggedOut>]}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
