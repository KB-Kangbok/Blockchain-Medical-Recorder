import React from 'react';


function Register() {
  
  return(
    <div className="registerPage">
      <h1>This is Register page.</h1>
      <div className="column">
        <input name="firstName" placeholder="Write your first name" type="text" />
        <input name="lastName" placeholder="Write your last name" type="text" />
        <input name="userName" placeholder="Write your username" type="text" />
        <input name="password" placeholder="Write your password" type="password" />
        <input name="cfPassword" placeholder="Confirm your password" type="password" />
     </div>
     <button>Sign Up</button>
    </div>
  )
}

export default Register;