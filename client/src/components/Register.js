import {useState} from 'react'

// The register form from the main page

function Register({setUser}) {
    const [userData, setUserData] = useState({})

    // Posting user's information to the database when register button is clicked
    const submit = (e) => {
        e.preventDefault()

        fetch("/users/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userData),
            mode: "cors"
        })
            .then(response => response.json())
            .then(data => {           
                let text = document.getElementById("text")
                if (data.message) {
                    text.innerText = data.message
                } else if (data.info) {
                    text.innerText = data.info
                    document.getElementById("registerform").reset()
                }
                console.log(data)
                if(data.token) {
                    setUser(JSON.parse(Buffer.from(data.token.split(".")[1], "base64").toString()))
                }
            })

    }
    
    // Updating user info when it changes
    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <h1 className='subheader'>Register</h1>
            <div className="row">
                <form id="registerform" className="col s12" onSubmit={submit} onChange={handleChange}>
                    <div className="row">
                        <div className="input-field col s6">
                            <input id="firstname" type="text" className="validate" name='firstname'/>
                            <label htmlFor="firstname">First Name</label>
                        </div>
                        <div className="input-field col s6">
                            <input id="lastname" type="text" className="validate" name='lastname'/>
                            <label htmlFor="lastname">Last Name</label>
                        </div>
                        <div className="input-field col s6">
                            <input id="email" type="text" className="validate" name='email'/>
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="input-field col s6">
                            <input id="password" type="password" className="validate" name='password'/>
                            <label htmlFor="password">Password</label>
                        </div>
                        <div>
                            <button className="btn waves-effect waves-light purple lighten-2" type="submit" name="action">Register
                                <i className="material-icons right"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <p id='text'></p>
        </div>    
    )

}

export default Register





