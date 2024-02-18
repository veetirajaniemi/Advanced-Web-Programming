//import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'


function Profile() {

    const {id} = useParams()
    const [userName, setUserName] = useState("")
    const [userBio, setUserBio] = useState("")

    const updateTextArea = () => {
        let textArea = document.getElementById("profiletext")
        textArea.style.height = 'auto'
        textArea.style.height = textArea.scrollHeight + 'px'
    }

    useEffect(() => {
        console.log("id: ", id)
        fetch("/users/profile/" + id)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                console.log("Nimi: ", data.name)
                console.log("Bio: ", data.bio)
                setUserName(data.name)
                if (data.bio) {
                    setUserBio(data.bio)
                    //updateTextArea()
                }
            })
    }, [])

    const updateBio = () => {
        let textArea = document.getElementById("profiletext")
        let bioText = textArea.value
        setUserBio(bioText)
        updateTextArea()
        
        fetch("/users/bio/" + id, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({bio: bioText}),
            mode: "cors"
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let infoP = document.getElementById("profileinfo")
            infoP.innerText = data.info
        })

    } 



    return (
    <div>
        <div className="row">
            <div className="col s12 m6">
                <div className="card pink">
                    <div className="card-content white-text">
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
    </div>
    )
}

export default Profile
