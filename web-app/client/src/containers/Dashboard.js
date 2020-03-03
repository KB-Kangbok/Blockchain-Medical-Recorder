import React, { useState } from "react";
import { Navbar, Nav, Row, Col } from "react-bootstrap";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import PostsService from "../services/apiservice"
import "./Dashboard.css";

export default function Dashboard(props) {    
  const [dash, setDash] = useState("0");
  const [fields, handleFieldChange] = useFormFields({
    patientId: props.userId,
    doctorId: "",
    authType: "give",
    createPatientId: "",
    date: "",
    symptom: "",
    medication: "",
    description: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);

  async function handleViewSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const apiResponse = await PostsService.queryRecords(props.userId, fields.patientId);
      console.log(apiResponse.data);
      if(apiResponse.data.error) {
        console.log("ERROR!!!");
        console.log(apiResponse.data.error);
      }
      
      setRecords(apiResponse.data);
      setIsLoading(false);
      setDash("4");
    } catch(e) {
      alert(e.message);
      setIsLoading(false);
    }
  }
  async function handleCreateSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const apiResponse = await PostsService.createRecord(props.userId, fields.createPatientId, fields.date, fields.symptom, fields.medication, props.firstName, fields.description);
      console.log(apiResponse.data);
      if(apiResponse.data.error) {
        console.log("ERROR!!!");
        console.log(apiResponse.data.error);
      }
      
      alert(`Successfully created new record for ${fields.createPatientId}`);
      setIsLoading(false);
      setDash("0");
    } catch(e) {
      alert(e.message);
      setIsLoading(false);
    }
  }
  async function handleViewSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const apiResponse = await PostsService.queryRecords(props.userId, fields.patientId);
      console.log(apiResponse.data);
      if(apiResponse.data.error) {
        console.log("ERROR!!!");
        console.log(apiResponse.data.error);
      }
      
      setRecords(apiResponse.data);
      setIsLoading(false);
      setDash("4");
    } catch(e) {
      alert(e.message);
      setIsLoading(false);
    }
  }
  async function handleDeleteSubmit(event) {
    event.preventDefault();

    let recordId = event.target.childNodes[0].childNodes[1].childNodes[0].data;

    setIsLoading(true);

    try {
      const apiResponse = await PostsService.deleteRecord(props.userId, recordId);
      console.log(apiResponse.data);
      if(apiResponse.data.error) {
        console.log("ERROR!!!");
        console.log(apiResponse.data.error);
      }
      
      alert(`Successfully deleted the record`);
      setIsLoading(false);
      setDash("1");
    } catch(e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      if(fields.authType === "give"){
        const apiResponse = await PostsService.giveAuth(props.userId, fields.doctorId);
        console.log(apiResponse.data);
        if(apiResponse.data.error) {
          console.log("ERROR!!!");
          console.log(apiResponse.data.error);
        }
        
        alert(`Now ${fields.doctorId} can see your medical records!`);
        setIsLoading(false);
      } else {
        const apiResponse = await PostsService.removeAuth(props.userId, fields.doctorId);
        console.log(apiResponse.data);
        if(apiResponse.data.error) {
          console.log("ERROR!!!");
          console.log(apiResponse.data.error);
        }

        alert(`Now ${fields.doctorId} cannot see your medical records`);
        setIsLoading(false);
      }
    } catch(e) {
      alert(e.message);
      setIsLoading(false);
    }
  }


  return (
    <div className="dashboard">
      <Row>
        <Col className="sidebar bg-light" xs={2}>
          <Nav defaultActiveKey="0" onSelect={selectedKey => setDash(selectedKey)} className="flex-column" variant="pills">
            <Nav.Item><Nav.Link eventKey="0">Home</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="1">View Record</Nav.Link></Nav.Item>
            {props.userType=="doctor" 
              ? <Nav.Item><Nav.Link eventKey="3">Create Record</Nav.Link></Nav.Item>
              : <> </>
            }
            <Nav.Link eventKey="2">Manage Access</Nav.Link>
          </Nav>
        </Col>
        <Col className="main">
            {dash==="0"
            ? <div className="greet">
                <h1>Hi {props.firstName}!</h1>
              </div>
            : dash==="1"
            ? 
                <form onSubmit={handleViewSubmit}>
                  <Col sm={10}>
                    <FormGroup as={Row} controlId="patientId">
                      <FormLabel column sm={8}>Choose patient to query record</FormLabel>
                      <Col>
                        <FormControl as="select" value={fields.patientId} onChange={handleFieldChange}>
                          {props.auth.map(key =>(
                            <option key={key}>{key}</option>
                          ))}
                        </FormControl>
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col sm={2}>
                    <LoaderButton
                      block
                      type="submit"
                      size="lg"
                      isLoading={isLoading}
                    >
                      Go!
                    </LoaderButton>
                  </Col>
                </form>
            : dash==="2"
            ? <form onSubmit={handleAuthSubmit}>
                <Col sm={10}>
                  <FormGroup as={Row} controlId="authType">
                      <FormLabel column sm={10}>Choose what to do with the access</FormLabel>
                      <Col>
                        <FormControl as="select" value={fields.authType} onChange={handleFieldChange}>
                          <option>give</option>
                          <option>remove</option>
                        </FormControl>
                      </Col>
                    </FormGroup>
                    <FormGroup as={Row} controlId="doctorId">
                      <FormLabel column sm={5}>Type in doctor's id</FormLabel>
                      <Col>
                        <FormControl 
                          type="text"
                          onChange={handleFieldChange}
                          value={fields.doctorId}
                        />
                      </Col>
                    </FormGroup>
                </Col>
                <Col sm={2}>
                  <LoaderButton
                    block
                    type="submit"
                    size="lg"
                    isLoading={isLoading}
                  >
                    Go!
                  </LoaderButton>
                </Col>
              </form>
            : dash==="3" 
            ? <form onSubmit={handleCreateSubmit}>
                <FormGroup controlId="createPatientId">
                  <FormLabel>Patient ID: </FormLabel>
                  <FormControl 
                    type="text"
                    value={fields.createPatientId}
                    onChange={handleFieldChange}
                  />
                </FormGroup>
                <FormGroup controlId="symptom">
                  <FormLabel>Symptom: </FormLabel>
                  <FormControl 
                    type="text"
                    value={fields.symptom}
                    onChange={handleFieldChange}
                  />
                </FormGroup>
                <FormGroup controlId="medication">
                  <FormLabel>Medication: </FormLabel>
                  <FormControl 
                    type="text"
                    value={fields.medication}
                    onChange={handleFieldChange}
                  />
                </FormGroup>
                <FormGroup controlId="date">
                  <FormLabel>Date (YYYY-MM-DD): </FormLabel>
                  <FormControl 
                    type="text"
                    value={fields.date}
                    onChange={handleFieldChange}
                  />
                </FormGroup>
                <FormGroup controlId="description">
                  <FormLabel>Any extra description: </FormLabel>
                  <FormControl 
                    type="text"
                    value={fields.description}
                    onChange={handleFieldChange}
                  />
                </FormGroup>
                <LoaderButton
                  block
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                >
                  Create
                </LoaderButton>
              </form>
            : <div>
                {records.length > 0 
                  ? <ol>
                    {records.map((item,index) => (
                    <li key={index}>
                      <form onSubmit={handleDeleteSubmit}>
                        <FormGroup as={Row}>
                          <FormLabel column sm={8}>
                            {item.patientId} {item.date} {item.symptom} {item.medication} {item.doctorName} {item.description}
                          </FormLabel>
                          <span className="invisible">{item.recordId}</span>
                        </FormGroup>
                        <Col sm={2}>
                          <LoaderButton
                            block
                            type="submit"
                            size="lg"
                            isLoading={isLoading}
                          >
                            Delete
                          </LoaderButton>
                        </Col>
                      </form>
                    </li>
                  ))}
                  </ol>
                : <h1>No results to show</h1>}
              </div>
            }
        </Col>
      </Row>
    </div>
  );
}