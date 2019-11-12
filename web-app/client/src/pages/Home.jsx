import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../component/Login';

class Home extends React.Component{
  render(){
    return(
      <div className="LoginPage">
        <Login page={this.props.page} user={this.props.user} handler={this.props.handler}/>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    )
  }
}

export default Home;