import React, { useState } from "react";
import { Navbar, Nav, Row, Col } from "react-bootstrap";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import PostsService from "../services/apiservice"
import "./Dashboard.css";
import View from "../components/View";
import Access from "../components/Access";

export default function Dashboard(props) {    
  const [dash, setDash] = useState("0");
  return (
    <div className="Dashboard">
      <Row>
        <Col className="sidebar" xs={2}>
          <Nav activeKey="0" onSelect={selectedKey => setDash(selectedKey)}>
            <Nav.Link eventKey="0">Home</Nav.Link>
            <Nav.Link eventKey="1">View Record</Nav.Link>
            {props.userType=="doctor" 
              ? <Nav.Link eventKey="3">Create Record</Nav.Link>
              : <> </>
            }
            <Nav.Link eventKey="2">Manage Access</Nav.Link>
          </Nav>
        </Col>
        <Col className="main">
            {dash==="0"
            ? <h1>Hi {props.firstName}!</h1>
            : dash==="1"
            ? <View />
            : dash==="2"
            ? <Access />
            : <div>This is create record</div>}
        </Col>
      </Row>
    </div>
  );
}