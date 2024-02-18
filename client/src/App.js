import './App.css';
import Browse from './components/Browse';
import Chatview from './components/Chatview';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from "./components/Register"
import { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {

  const [jwt, setJwt] = useState("")
  const [user, setUser] = useState({})
  //const [userName, setUsername] = useState("")

  /*useEffect(() => {
    try {
      if (jwt && user.email) {
        async function getName() {
          let response = await fetch("/users/" + user.email)
          let data = await response.json()
          return data.name
        }
        getName()
        .then((name) => setUsername(name))
      }
    } catch(err) {
      console.log(err)
    }
    
  }, [jwt, user.email])*/


  return (
    <Router>
      <div className="App">
        {/*<h1>{jwt ? `Hi ${userName}` :""}</h1>
        <Profile></Profile>
        <Register></Register>
        {!user?.id?.length > 0 &&
        <Login setJwt={setJwt} setUser={setUser} jwt={jwt}></Login>
        }*/}
        {/*<h1>{jwt ? `Hi ${userName}` :""}</h1>,*/}

        <Routes>
          <Route path="/" element={[<Register></Register>, <Login setJwt={setJwt} setUser={setUser} jwt={jwt}></Login>]}></Route>
          <Route path="/user/:id" element={<Profile></Profile>}> </Route>
          <Route path="/browse/:id" element={<Browse></Browse>}> </Route>
          <Route path="/chat/:id" element={<Chatview></Chatview>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
