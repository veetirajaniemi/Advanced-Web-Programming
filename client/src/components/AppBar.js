import {useEffect, useState} from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'
import M from 'materialize-css'


// The appbar is shown on every page. It includes the buttons for the app and handles the logout.
// It uses a simple side bar for mobile devices.

function AppBar() {

    const {id} = useParams()
    const path = useLocation().pathname

    // Defines if the buttons are shown or not
    const [buttons, setButtons] = useState(false)


    useEffect(() => {

        // Sidebar from (https://materializecss.com/sidenav.html)
        const options = {}
        const elems = document.querySelectorAll('.sidenav')
        M.Sidenav.init(elems, options)

        if (path !== "/" && path !== "/error") {
            setButtons(true) // Buttons are shown
        } 


    },[])

    // Logout fetch to disable jsonwebtoken
    const logout = () => {
        console.log("logout")
        fetch("/users/logout")
        setButtons(false)
    }


    return (
        <div>
            <nav>
                <div className="nav-wrapper pink">
                <Link to="#" className="brand-logo center">TINDERI</Link>
                {buttons && <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>}
                <ul className="right hide-on-med-and-down">
                {buttons && <ul id="nav-mobile" className="left hide-on-med-and-down">
                    <li key={"user" + id}><Link to={"/user/" + id}>Your profile</Link></li>
                    <li key={"browse" + id}><Link to={"/browse/" + id}>Browse users</Link></li>
                    <li key={"chat" + id}><Link to={"/chat/" + id}>Chat</Link></li>
                    <li key={"logout" + id}><Link to={"/logout"} onClick={logout}>Logout</Link></li>
                </ul>}
                </ul>
                </div>
            </nav>

            <ul className="sidenav pink lighten-4" id="mobile-demo">
                <li key={"user-side" + id}><Link to={"/user/" + id}>Your profile</Link></li>
                <li key={"browse-side" + id}><Link to={"/browse/" + id}>Browse users</Link></li>
                <li key={"chat-side" + id}><Link to={"/chat/" + id}>Chat</Link></li> 
                <li key={"logout-side" + id}><Link to={"/logout"} onClick={logout}>Logout</Link></li>
            </ul>
        </div>
    )

}

export default AppBar
