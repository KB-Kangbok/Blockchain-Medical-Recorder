import React from 'react';
import {Link} from 'react-router-dom';

function UserMenu(userType){
  return(
    <div>
      <Link to="/">Home</Link>
      <Link to="/profile">My Profile</Link>
      <Link to="/importRecord">Import Record</Link>
      <Link to="/sendRecord">Send Record</Link>
    </div>
  )
}

export default UserMenu;