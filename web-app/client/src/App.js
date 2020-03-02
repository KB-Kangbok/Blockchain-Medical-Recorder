import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import { LinkContainer } from "react-router-bootstrap";

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      // await Auth.currentSession();
      userHasAuthenticated(false);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    setIsAuthenticating(false);
  }

  function handleLogout() {
    userHasAuthenticated(false);
    props.history.push("/login");
  }

  return (
    !isAuthenticating &&
    <div className="App container">
      <Navbar bg="light" expand="lg" fluid="true" variant="light" collapseOnSelect>
        <Navbar.Brand>
          <Link to="/">Home</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav variant="pills">
          {isAuthenticated
            ? <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
            : <>
                <LinkContainer to="/signup">
                  <Nav.Item>Signup</Nav.Item>     
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Item>Login</Nav.Item>
                </LinkContainer>
              </>
          }
              </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
    </div>
  );
}

export default withRouter(App);
