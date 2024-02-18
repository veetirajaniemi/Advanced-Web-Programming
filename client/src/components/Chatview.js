import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Chat from './Chat'


function Chatview() {

  const {id} = useParams()
  const [userList, setUserList] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedUserName, setSelectedUserName] = useState("")

  useEffect(() => {
    fetch("/users/getchat/" + id)
    .then(response => response.json())
    .then((data) => {
      console.log(data)
      setUserList(data)
    })
  }, [id])

  const selectUser = (curId, curName) => {
    setSelectedUser(curId)
    setSelectedUserName(curName.split(" ")[0])
  }

  return (
    <div>
      <h1>Chat</h1>
        <div className='split'>
          <div className="collection" style={{ width: '50%' }}>
            {userList?.map(user => (
              <a key={user.id} className="collection-item" onClick={() => {selectUser(user.id, user.name)}}><span className="badge"></span>{user.name}</a>
            ))}
          </div>
          <div style={{ width: '50%' }}>
            {selectedUser && <Chat key={id + "+" + selectedUser} user1={id} user2={selectedUser} user2name={selectedUserName}></Chat>}
          </div>
        </div>
    </div>
  )
}

export default Chatview
