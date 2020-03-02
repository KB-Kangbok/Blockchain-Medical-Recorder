import React, { useState } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import PostsService from "../services/apiservice"
import "./Login.css";

export default function Login(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    userId: "",
    password: ""
  });

  function validateForm() {
    return fields.userId.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
    try {
      // await Auth.signIn(email, password);
      const apiResponse = await PostsService.validateUser(fields.userId, fields.password);
      console.log("apiResponse");
      console.log(apiResponse.data);

      if(apiResponse.data.error) {
        console.log(apiResponse.data.error);
      } else{
        alert("Logged in");
        props.userHasAuthenticated(true);
        props.history.push("/");
      }
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="userId" size="lg">
          <FormLabel>User Id</FormLabel>
          <FormControl
            autoFocus
            value={fields.userId}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" size="lg">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={fields.password}
            onChange={handleFieldChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </form>
    </div>
  );
}