import {Link} from 'react-router-dom'

// Error page which is shown when there is an authentication error
function Error() {
  return (
    <div>
        <h1>Authentication error. </h1>
        <Link to={"/"}>Click to get to the home page. </Link>
    </div>
  )
}

export default Error
