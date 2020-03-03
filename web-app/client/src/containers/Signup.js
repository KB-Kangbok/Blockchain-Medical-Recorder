import React, { useState } from "react";
import {
  FormGroup,
  FormControl,
  FormLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./Signup.css";
import PostsService from "../services/apiservice"

export default function Signup(props) {
  const [fields, handleFieldChange] = useFormFields({
    userId: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    userType: "patient"
  });
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.userId.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword &&
      fields.firstName.length > 0 &&
      fields.lastName.length > 0
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const apiResponse = await PostsService.registerUser(fields.userId, fields.userType, fields.firstName, fields.lastName, fields.password);
      const newUser = {username: fields.userId, password: fields.password};

      console.log(apiResponse.data);
      if(apiResponse.data.error) {
        console.log("ERROR!!!");
        console.log(apiResponse.data.error);
      }
      setNewUser(newUser);
      setIsLoading(false);
      
      alert(`Successfully registered ${fields.userId}!`);
      props.history.push("/login");
    } catch(e) {
      alert(e.message);
      setIsLoading(false);
    }

  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="userType" size="lg">
          <FormLabel>Type</FormLabel>
          <FormControl as="select" value={fields.userType} onChange={handleFieldChange}>
            <option>patient</option>
            <option>doctor</option>
          </FormControl>
        </FormGroup>
        <FormGroup controlId="userId" size="lg">
          <FormLabel>User ID</FormLabel>
          <FormControl
            autoFocus
            type="text"
            value={fields.userId}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" size="lg">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" size="lg">
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </FormGroup>
        <FormGroup controlId="firstName" size="lg">
          <FormLabel>First Name</FormLabel>
          <FormControl 
            type="text"
            onChange={handleFieldChange}
            value={fields.firstName}
          />
        </FormGroup>
        <FormGroup controlId="lastName" size="lg">
          <FormLabel>Last Name</FormLabel>
          <FormControl 
            type="text"
            onChange={handleFieldChange}
            value={fields.lastName}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Sign Up
        </LoaderButton>
      </form>
    );
  }

  return (
    <div className="Signup">
      {renderForm()}
    </div>
  );
}