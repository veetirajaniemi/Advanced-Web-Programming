import { useState, useEffect } from 'react'

/* The chat between two users, user1 and user2, 
given as props. The user1 is logged in and has chosen
user2 from the chat list. */

function Chat(props) {

  const [messages, setMessages] = useState(null)
  const [newMessage, setNewMessage] = useState(false)
  const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // Fetching the chat of two users
  const fetchChat = () => {
    fetch("/users/chat/" + props.user1 + "+" + props.user2)
    .then(response => response.json())
    .then(data => {
      console.log(data)

      if (data.message === "Authentication failed.") {
        window.location.href = "/error"
      }

      if (data.length > 0) {
        setMessages(data) // Updating messages if there are some.
      }
    })
  }

  // Fetching when new message is in chat. 
  useEffect(() => {
    fetchChat()
  }, [newMessage])

  // Sending the message to the chat database. 
  const sendMsg = () => {
    let textArea = document.getElementById("msg")
    let msg = textArea.value
    if (!msg) return // Message has to include something
    let date = new Date()
    let time = weekday[date.getDay()] + " " + date.getHours() + ":" + date.getMinutes() // Time stamp
    setMessages([]) 
    setNewMessage(false)


    fetch("/users/chat/" + props.user1 + "+" + props.user2, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        message: msg,
        time: time
      }),
      mode: "cors"
    })
    .then(response => response.json())
    .then(data => {

      if (data.message === "Authentication failed.") {
        window.location.href = "/error"
      } 
      
      console.log(data)
      setNewMessage(true)
      textArea.value = ""
    })
  }

  return (
    <div>
      <div className='scroll' id='msgdiv'>
        {Array.isArray(messages) ? ( // Getting messages to correct side of chat with correct colour
          messages.map((messageObj, index) => {
          if(messageObj.user === props.user1) { // Message of a user who is logged in
            return(
              <div key={props.user1 + "+" + props.user2 + index} className='chat-container pink accent-1'>
                <p className='title-right'>You</p>
                <p className='p-right'>{messageObj.msg}</p>
                <span className="time-right" style={{color: 'black'}}>{messageObj.time}</span>
              </div>
            )
          } else { // Message of the other user
            return(
              <div key={props.user2 + "+" + props.user1 + index} className='chat-container pink accent-2'>
                <p className='title-left'>{props.user2name}</p>
                <p className='p-left'>{messageObj.msg}</p>
                <span className="time-left" style={{color: 'black'}}>{messageObj.time}</span>
              </div>
            )
          }
        })) : <p>Start a chat with {props.user2name}!</p>} 
      </div>


      <div className='container-msg'>
        <div className="input-field col s6">
            <i className="material-icons prefix">mode_edit</i>
            <textarea id="msg" className="materialize-textarea" placeholder='Your message:'></textarea>
            <button onClick={sendMsg} className="btn waves-effect waves-light purple lighten-2" type="submit" name="action">Send
              <i className="material-icons right">send</i>
            </button>
            <button onClick={fetchChat} className="btn waves-effect waves-light purple lighten-3" type="submit" name="action">Refresh
              <i className="material-icons right">autorenew</i>
            </button>

        </div>
      </div>
    </div>
  )
}

export default Chat
