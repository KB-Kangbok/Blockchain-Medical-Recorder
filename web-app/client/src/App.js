import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar, Nav, Row } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import { LinkContainer } from "react-router-bootstrap";

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("patient");
  const [dash, setDash] = useState(0);

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
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
    setUserId("");
    setFirstName("");
    setLastName("");
    props.history.push("/login");
  }

  return (
    !isAuthenticating &&
    <div className="App container">
      <Navbar bg="light" expand="lg" fluid="true" variant="light" collapseOnSelect>
        <Navbar.Brand>
          {isAuthenticated 
            ? <Link to="/dashboard">Dashboard</Link>
            : <Link to="/">Home</Link>
          }
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav variant="pills">
          {isAuthenticated
            ? <Row>
                <Navbar.Text>
                  Signed in as: {firstName}
                </Navbar.Text>
                <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
              </Row>
            : <Row>
                <LinkContainer to="/signup">
                  <Nav.Item>Signup</Nav.Item>     
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Item>Login</Nav.Item>
                </LinkContainer>
              </Row>
          }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated, userId, setUserId, firstName, setFirstName, lastName, setLastName, userType, setUserType, dash, setDash }} />
    </div>
  );
}

export default withRouter(App);
