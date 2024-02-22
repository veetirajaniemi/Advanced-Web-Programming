import {useState} from 'react'

// Login view shown on the main page

function Login() {
    const [userData, setUserData] = useState({})
    
    /* Logging in when the login button is clicked and
    fetching jsonwebtoken which is used for authentication.  */
    const submit = (e) => {
        e.preventDefault()

        fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userData),
            credentials: 'include',
            mode: "cors"
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) { // Login complete, redirect to user's profile page
                    let id = JSON.parse(atob(data.token.split(".")[1])).id
                    window.location.href = "/user/" + id
                } else { // Login failed, showing info message
                    let text = document.getElementById("logintext")
                    text.innerText = data.message
                }
            })

    }
 
    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <h1 className='subheader'>Login</h1>
            <div className="row">
                <form className="col s12" onSubmit={submit} onChange={handleChange}>
                    <div className="row">
                        <div className="input-field col s6">
                            <input id="loginemail" type="email" className="validate" name='email'/>
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="input-field col s6">
                            <input id="loginpassword" type="password" className="validate" name='password'/>
                            <label htmlFor="password">Password</label>
                        </div>
                        <div>
                            <button className="btn waves-effect waves-light purple lighten-2">Login
                                <i className="material-icons right"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <p id='logintext'></p>
        </div>
    )
}

export default Login

