import React from 'react';
import './App.css';
import { Link, Switch, Route, Prompt, BrowserRouter as Router, Redirect } from 'react-router-dom'; 

import Register from './pages/Register';
import NotFoundPage from './pages/404';
import Patient from './pages/Patient';
import Doctor from './pages/Doctor';
import Home from './pages/Home';


class App extends React.Component{
  constructor(){
    super();
    this.state={page:"0",user:""}

    this._loginSubmit=this._loginSubmit.bind(this);
  }

  _loginSubmit(page, user) {
    this.setState({
      page:page,
      user:user
    })
    if (page==="2"){
      return (
        <Redirect to="/patient" />
      )  
    }
    else if(page==="3"){
      return (
        <Redirect to="/doctor" />
      )
    }
  }
  
  _header = (page, user) => {
    if(page==="0" || page==="1"){
      this.page="0";
      return (
        <Link to="/">
          <img src="https://images.unsplash.com/photo-1569338757078-66f98692599e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80" alt="Home" title="Home" />
        </Link>
      )
    }
    else{
      return (
        <h1>Hi {user}</h1>
      )
    }
  }
  
  render(){
    console.log(this.state)
    return (
      <Router>
        <div className="App">
          <div className="AppHeader">
            {this._header(this.state.page,this.state.user)}
          </div>

          <Switch>
            <Route exact path="/">
              <Home handler={this._loginSubmit} />
            </Route>
            <Route exact path="/register" component={Register} />
            <Route exact path="/patient" component={Patient} />
            <Route exact path="/doctor" component={Doctor} />
            <Route exact path="/404" component={NotFoundPage} />
            <Redirect to="/404" />
          </Switch>
          
        </div>


      </Router>
    );
  }
}

export default App;
