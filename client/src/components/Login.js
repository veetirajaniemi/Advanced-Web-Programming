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
                    setUser(JSON.parse(atob(data.token.split(".")[1])))
                }
            })

    }
 
    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})

    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={submit} onChange={handleChange}>
                <input type="text" name="email"/>
                <input type='password' name="password"/>
                <input type="submit" />
            </form>
        </div>
    )
}

export default Login

