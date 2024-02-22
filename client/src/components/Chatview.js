import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Chat from './Chat'

/* Chatview includes the list of matches to start chatting with.
   It initializes the chat when user chooses a person to chat with. */
function Chatview() {

  const {id} = useParams()
  const [userList, setUserList] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedUserName, setSelectedUserName] = useState("")

  // Fetching matches to chat with
  useEffect(() => {
    fetch("/users/getchat/" + id)
    .then(response => response.json())
    .then((data) => {
      if (data.message === "Authentication failed.") {
        window.location.href = "/error"
      } 
      setUserList(data)
    })
  }, [id])

  // Updating id and name of selected user to chat with
  const selectUser = (curId, curName) => {
    setSelectedUser(curId)
    setSelectedUserName(curName.split(" ")[0])
  }

  return (
    <div>
      <h1 className='subheader'>CHAT</h1>
        <div className='split'>
          <div className="collection" style={{ width: '30%' }}>
            {userList?.length > 0 ? ( 
              userList.map(user => ( // Creating the user list to chat with, info text shown if no matches found
              <a style={{color: 'white'}} key={user.id} className="collection-item pink lighten-2" onClick={() => {selectUser(user.id, user.name)}}><span className="badge"></span>{user.name}</a>
            ))): <p className='noMatches'>You don't have matches to chat with! Browse more users! </p>}
          </div>
          <div style={{ width: '70%' }}> {/* Chat element created based on users' id's and name's */}
            {selectedUser && <Chat key={id + "+" + selectedUser} user1={id} user2={selectedUser} user2name={selectedUserName}></Chat>}
          </div>
        </div>
    </div>
  )
}

export default Chatview
