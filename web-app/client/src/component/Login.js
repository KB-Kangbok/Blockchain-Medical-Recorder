import React from 'react';
import { Link } from 'react-router-dom';

class Login extends React.Component {
  constructor(){
    super();

    this._submit=this._submit.bind(this);
  }

  _submit() {
    this.props.handler("2","KB")
  }

  render(){
    return(
      <div>
        <h2>Welcome to Medical Recorder</h2>
        <h3>Login here</h3>
        <form onSubmit={this._submit}>
          <label>Username: </label>
          <input name="username" type="text" placeholder="username" />
          <br></br>
          <label>Password: </label>
          <input name="password" type="password" placeholder="password" />
          <br></br>
          <input type="submit" value="Login" />
        </form>
      </div>
    )
  }
}

export default Login;