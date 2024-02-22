import {Link} from 'react-router-dom'

// Page to be shown when a user logs out. 
function LoggedOut() {
  return (
    <div>
        <h1>You logged out.</h1>
        <Link to={"/"}>Click to get to the home page. </Link>
    </div>
  )
}

export default LoggedOut
