import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// The view shown when browsing through new users
// Inludes the possibilities to like and dislike with other users 

function Browse() {

    const {id} = useParams()
    const [userName, setUserName] = useState("")
    const [userBio, setUserBio] = useState("")
    const [userId, setUserId] = useState("")

    // Relocating to chat view if no more users left
    const relocate = () => {
        window.location.replace("/chat/" + id)
    }

    // Reloading the page
    const reload = () => {
        window.location.reload()
    }

    /* Fetching new user from the server and updates its' info. 
    If user not found, redirects to chat view. */

    useEffect(() => {
        fetch("/users/browse/" + id)
        .then(response => response.json())
        .then(data => {

            if (data.message === "Authentication failed.") {
                window.location.href = "/error"
            } 

            if (data.message) {
                let noMatchInfo = document.getElementById("nothingToBrowse")
                noMatchInfo.innerText = "No more users left. Redirecting to chat..."
                setTimeout(relocate, 2000)
            }
            setUserName(data.name)
            if (data.bio) {
                setUserBio(data.bio)
            }
            setUserId(data._id)
        })
    }, [])


    /* Handles liking of a user when like button is pressed.
       Updates the database of users with likers info and informs 
       the user about possible match. */

    const like = () => {

        fetch("/users/like", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                liker: id,
                liked: userId
            }),
            mode: "cors"
        })
        .then(response => response.json())
        .then(data => {

            if (data.message === "Authentication failed.") {
                window.location.href = "/error"
            } 

            let info = document.getElementById("likeinfo")
            if (data.message === "Not a match.") {
                info.innerText = "You liked " + userName.split(" ")[0] + "!"
                setTimeout(reload, 1000) // Timeout to see info messages
            } else if (data.message === "It's a match") {
                info.innerText = "It's a match! " + userName.split(" ")[0] + " likes you too!"
                setTimeout(reload, 3000)
            }
            setTimeout(reload, 1000)
        })
    }

    /* Handles disliking of a user when dislike button is pressed.
        updates the database of users with disliker's info. */
        
    const dislike = () => {
        fetch("/users/dislike", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                disliker: id,
                disliked: userId
            }),
            mode: "cors"
        })
        .then(response => response.json())
        .then(data => {
            
            if (data.message === "Authentication failed.") {
                window.location.href = "/error"
            } 

            if (data.message === "You disliked.") {
                let info = document.getElementById("likeinfo")
                info.innerText = "You disliked " + userName.split(" ")[0] + "."
                setTimeout(reload, 1000)
            } else if (data.message === "Authentication failed.") {
                window.location.href = "/error"
            }
        })
    }


    return (
    <div>
        <h1 className='subheader'>Browse</h1>
        {userName ? (
        <div className="container"> 
            <div className="col s12 m6">
                <div className="card pink lighten-2">
                    <div className="card-content white-text">
                        <span id="curproftitle" className="card-title">{userName}</span>
                        <div className="row">
                            <form className="col s12">
                                <div className="row s5">
                                    <div className="input-field col s12">
                                        <textarea readOnly className="default-size" value={userBio}></textarea>
                                        <label htmlFor="curproftext"></label>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <button onClick={like} className="btn waves-effect waves-light pink accent-3">LIKE
                        <i className="material-icons right">favorite</i>
                    </button>
                    <button onClick={dislike} className="btn waves-effect waves-light grey lighten-1">DISLIKE
                        <i className="material-icons right">thumb_down</i>
                    </button>
                    <p id='likeinfo'></p>
                </div>
            </div>
        </div>
        ) : (<p id='nothingToBrowse'></p>)}
    </div>
    )
}

export default Browse


