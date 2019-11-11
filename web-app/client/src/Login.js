import React from 'react';
import './Login.css';
import Register from './Register';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

class Login extends React.Component{  
  render(){
    return (
      <Router>
        <div>
          <h3>Login here</h3>
          <form>
            <label>Username</label>
            <input name="username" type="text" placeholder="username" />
            <br></br>
            <label>Password</label>
            <input name="password" type="password" placeholder="password" />
            <br></br>
            <button type="submit">
              Login
            </button>
          </form>
          <Link to="/register">
            <button>Register</button>
          </Link>

          <Switch>
            <Route path="/register">
              <Register />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Login;