import {useState} from 'react'


function Login({setJwt, jwt, setUser}) {
    const [userData, setUserData] = useState({})

    const submit = (e) => {
        e.preventDefault()

        fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userData),
            mode: "cors"
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.token) {
                    setJwt(data.token)
                    let id = JSON.parse(atob(data.token.split(".")[1])).id
                    setUser(JSON.parse(atob(data.token.split(".")[1])))
                    window.location.href = "/user/" + id
                } else {
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
            <h1>Login</h1>
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
                            <button className="btn waves-effect waves-light">Login
                                <i className="material-icons right">send</i>
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

