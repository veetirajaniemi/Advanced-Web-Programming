import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


function Browse() {

    const {id} = useParams()
    const [userName, setUserName] = useState("")
    const [userBio, setUserBio] = useState("")
    const [userId, setUserId] = useState("")


    useEffect(() => {
        fetch("/users/browse/" + id)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.message) {
                // no more users left
                window.location.href = "/chat/" + id
            }
            setUserName(data.name)
            if (data.bio) {
                setUserBio(data.bio)
            }
            setUserId(data._id)
        })
    }, [])

    const like = () => {
        console.log(id)
        console.log(userId)
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
            console.log(data)
            let info = document.getElementById("likeinfo")
            if (data.message === "Not a match.") {
                info.innerText = "You liked " + userName.split(" ")[0] + "!"
            } else if (data.message === "It's a match") {
                info.innerText = "It's a match! " + userName.split(" ")[0] + " likes you too!"
            }
            window.location.reload()
        })
    }

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
            console.log(data)
            if (data.message === "You disliked.") {
                let info = document.getElementById("likeinfo")
                info.innerText = "You disliked " + userName.split(" ")[0] + "."
                window.location.reload()
            }
        })
    }


    return (
    <div>
        <div className="row">
            <div className="col s12 m6">
                <div className="card pink">
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
                <div className="button-container">
                    <button onClick={like} className="btn waves-effect waves-light pink accent-3">LIKE
                        <i className="material-icons right">favorite</i>
                    </button>
                    <button onClick={dislike} className="btn waves-effect waves-light grey lighten-1">DISLIKE
                        <i className="material-icons right">thumb_down</i>
                    </button>
                </div>
                <p id='likeinfo'></p>
            </div>
        </div>
    </div>
    )
}

export default Browse


