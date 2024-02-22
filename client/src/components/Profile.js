//import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

/* The profile page of user include the profile card of the user which's
    text can be modified */

function Profile() {

    const {id} = useParams()
    const [userName, setUserName] = useState("")
    const [userBio, setUserBio] = useState("")


    // Updating text area's size based on profile text. 
    const updateTextArea = () => {
        let textArea = document.getElementById("profiletext")
        textArea.style.height = 'auto'
        textArea.style.height = textArea.scrollHeight + 'px'
    }

    // Fetching the name and profile text of current user
    useEffect(() => {
        fetch("/users/profile/" + id)
            .then(response => response.json())
            .then(data => {
                if (data.message === "Authentication failed.") {
                    window.location.href = "/error"
                } 
                setUserName(data.name)
                if (data.bio) {
                    setUserBio(data.bio)
                }
            })
    }, [])

    // Updating new bio to the database
    const updateBio = () => {
        let textArea = document.getElementById("profiletext")
        let bioText = textArea.value
        setUserBio(bioText)
        updateTextArea()
        
        fetch("/users/profile/" + id, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({bio: bioText}),
            mode: "cors"
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Authentication failed.") {
                window.location.href = "/error"
            } 
            let infoP = document.getElementById("profileinfo")
            infoP.innerText = data.info
        })

    } 



    return (
    <div>
        <h1 className='subheader'>Your profile</h1>
        <div className="row container">
            <div className="card pink">
                <div className="card-content white-text pink lighten-2">
                    <span id="profiletitle" className="card-title">{userName}</span>
                    <div className="row">
                        <form className="col s12">
                            <div className="row s5">
                                <div className="input-field col s12">
                                    <textarea onChange={(e) => setUserBio(e.target.value)} id="profiletext" className="default-size" value={userBio} maxLength={500} placeholder="Write your profile text here (max 500 characters):"></textarea>
                                    <label htmlFor="profiletext"></label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <p id="profileinfo"></p>
            <button onClick={updateBio} className="btn waves-effect waves-light purple lighten-2" name="action">Update profile!
                <i className="material-icons right">edit</i>
            </button>
            <br></br>
            <br></br>             
            <Link to={`/browse/${id}`}>
                <button className="btn waves-effect waves-light purple lighten-2">Browse other users!
                    <i className="material-icons right">search</i>
                </button>
            </Link>
            <br></br>
            <br></br>
            <Link to={`/chat/${id}`}>
            <button className="btn waves-effect waves-light purple lighten-2">Chat
                    <i className="material-icons right">chat</i>
                </button>                    
            </Link>
        </div>
    </div>
    )
}

export default Profile
