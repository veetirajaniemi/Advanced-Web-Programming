import './App.css';
import Login from './components/Login';
import { useState } from 'react';

function App() {

  const [jwt, setJwt] = useState("")
  const [user, setUser] = useState({})
  

  return (
    <div className="App">
      <h1>{jwt ? `Hi ${user.email}` : ""}</h1>
      {!user?.id?.length > 0 &&
      <Login setJwt={setJwt} setUser={setUser} jwt={jwt}></Login>
      }
    </div>
  );
}

export default App;
