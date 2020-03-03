import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar, Nav, Row } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import 'bootstrap/dist/css/bootstrap.min.css';
import { LinkContainer } from "react-router-bootstrap";

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("patient");
  const [records, setRecords] = useState([]);
  const [auth, setAuth] = useState([]);
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
      <Navbar className="bg-light justify-content-between" expand="lg" fluid="true" variant="light" collapseOnSelect>
        <Navbar.Brand>
          {isAuthenticated 
            ? <Link to="/dashboard">Dashboard</Link>
            : <Link to="/">Home</Link>
          }
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav variant="pills">
          {isAuthenticated
            ? <Row className="mr-auto">
                <Nav>
                  <Nav.Item className="mr-sm-3">
                    Signed in as: {userId}
                  </Nav.Item>
                  <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
                </Nav>
              </Row>
            : <Row className="mr-auto">
                <Nav.Link href="/signup" className="mr-sm-3">
                  <Nav.Item>Sign Up</Nav.Item>     
                </Nav.Link>
                
                <Nav.Link href="/login">
                  <Nav.Item>Login</Nav.Item>
                </Nav.Link>
              </Row>
          }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated, userId, setUserId, firstName, setFirstName, lastName, setLastName, userType, setUserType, dash, setDash, records, setRecords, auth, setAuth }} />
    </div>
  );
}

export default withRouter(App);
