import { useState, useEffect } from 'react'


function Chat(props) { // user 1 on valinnut user 2:n

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState(false)

  useEffect(() => {
    console.log(props.user1 + props.user2) 
    fetch("/users/chat/" + props.user1 + "+" + props.user2)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setMessages(data)
    })

  }, [newMessage])

  const sendMsg = () => {
    let textArea = document.getElementById("msg")
    let msg = textArea.value
    let date = new Date()
    let time = date.getHours() + ":" + date.getMinutes() 
    setMessages([])

    console.log("täällä")

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
      console.log(data)
      setNewMessage(true)

      //window.location.reload()
    })
  }

  return (
    <div>
      <div>
        {messages?.map((messageObj, index) => {
          if(messageObj.user === props.user1) {
            return(
              <div key={props.user1 + "+" + props.user2 + index} className='container'>
                <p className='title-right'>You</p>
                <p className='p-right'>{messageObj.msg}</p>
                <span className="time-right">{messageObj.time}</span>
              </div>
            )
          } else {
            return(
              <div key={props.user2 + "+" + props.user1 + index} className='container'>
                <p className='title-left'>{props.user2name}</p>
                <p className='p-left'>{messageObj.msg}</p>
                <span className="time-left">{messageObj.time}</span>
              </div>
            )
          }
        })}
      </div>


      <div className='container-msg'>
        <div className="input-field col s6">
            <i className="material-icons prefix">mode_edit</i>
            <textarea id="msg" className="materialize-textarea" placeholder='Your message:'></textarea>
            <button onClick={sendMsg} className="btn waves-effect waves-light" type="submit" name="action">Send
              <i className="material-icons right">send</i>
            </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
