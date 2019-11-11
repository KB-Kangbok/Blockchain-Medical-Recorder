import React from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import { Link, Switch, Route, Prompt, BrowserRouter as Router } from 'react-router-dom'; 

class App extends React.Component{
  render(){
    return (
      <Router>
        <div className="App">
          <div className="AppHeader">

          </div>
          <div className="LoginPage">
            <Link to="/"></Link>
          </div>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
          </Switch>
        </div>


      </Router>
    );
  }
}

export default App;
