'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');

let network = require('./fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

//use this identity to query
const appAdmin = config.appAdmin;

//query for certain objects within the world state
app.post('/queryWithQueryString', async (req, res) => {

  let networkObj = await network.connectToNetwork(appAdmin);
  let response = await network.invoke(networkObj, true, 'queryRecords', req.body.selected);
  let parsedResponse = await JSON.parse(response);
  res.send(parsedResponse);

});

//get user records
app.post('/queryRecords', async (req,res) => {
  console.log('req.body: ');
  console.log(req.body);
  let args = [req.body];

  let networkObj = await network.connectToNetwork(appAdmin);
  console.log('after network OBj');
  let response = await network.invoke(networkObj, true, 'queryRecords', args);
  let parsedResponse = await JSON.parse(response);
  res.send(parsedResponse);
});

//give auth to doctor
app.post('/giveAuth', async (req,res) => {
  console.log('req.body: ');
  console.log(req.body);
  let args = [req.body];

  let networkObj = await network.connectToNetwork(appAdmin);
  console.log('after network OBj');
  let response = await network.invoke(networkObj, false, 'giveAuth', args);
  if(response.error){
    res.send(response.error);
  } else {
    console.log('response: ');
    console.log(response);
    res.send(response);
  }
});

//remove auth to doctor
app.post('/removeAuth', async (req,res) => {
  console.log('req.body: ');
  console.log(req.body);
  let args = [req.body];

  let networkObj = await network.connectToNetwork(appAdmin);
  console.log('after network OBj');
  let response = await network.invoke(networkObj, false, 'removeAuth', args);
  if(response.error){
    res.send(response.error);
  } else {
    console.log('response: ');
    console.log(response);
    res.send(response);
  }
});

//create record
app.post('/createRecord', async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);
  let args = [req.body.args];

  let networkObj = await network.connectToNetwork(req.body.userId);
  console.log('after network OBj')
  let response = await network.invoke(networkObj,false,'createRecord', args);
  if (response.error) {
    res.send(response.error);
  } else {
    console.log('response: ');
    console.log(response);
    res.send(response);
  }
});

//delete record
app.post('/deleteRecord', async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);
  let args = [req.body.args];

  let networkObj = await network.connectToNetwork(req.body.userId);
  console.log('after network OBj')
  let response = await network.invoke(networkObj,false,'deleteRecord', args);
  if (response.error) {
    res.send(response.error);
  } else {
    console.log('response: ');
    console.log(response);
    res.send(response);
  }
});

//get user info, create user object, and update state with their userId
app.post('/registerUser', async (req, res) => {

  console.log('req.body: ');
  console.log(req.body);
  let userId = req.body.userId;

  //first create the identity for the user and add to wallet
  let response = await network.registerUser(userId, req.body.userType, req.body.firstName, req.body.lastName, req.body.password);
  console.log('response from registerUser: ');
  console.log(response);
  if (response.error) {
    res.send(response.error);
  } else {
    console.log('req.body.userId');
    console.log(req.body.userId);
    let networkObj = await network.connectToNetwork(userId);
    console.log('networkobj: ');
    console.log(networkObj);

    if (networkObj.error) {
      res.send(networkObj.error);
    }
    console.log('network obj');
    console.log(util.inspect(networkObj));

    req.body = JSON.stringify(req.body);
    let args = [req.body];
    //connect to network and update the state with userId  

    let invokeResponse = await network.invoke(networkObj, false, 'createUser', args);
    
    if (invokeResponse.error) {
      res.send(invokeResponse.error);
    } else {

      console.log('after network.invoke ');
      let parsedResponse = JSON.parse(invokeResponse);
      parsedResponse += '. Use userId to login above.';
      res.send(parsedResponse);
    }
  }

});
  
//used as a way to login the user to the app 
app.post('/validateUser', async (req, res) => {

  console.log('req.body: ');
  console.log(req.body);
  let networkObj = await network.connectToNetwork(req.body.userId);
  console.log('networkobj: ');
  console.log(util.inspect(networkObj));

  if (networkObj.error) {
    res.send(networkObj);
  }

  let invokeResponse = await network.invoke(networkObj, true, 'readUser', req.body.userId);
  if (invokeResponse.error) {
    res.send(invokeResponse);
  } else {
    console.log('after network.invoke ');
    let parsedResponse = await JSON.parse(invokeResponse);
    console.log(parsedResponse);
    let userPW = parsedResponse.password;

    if (userPW != req.body.password) {
      let response = {};
      response.error = `Invalid password for ${req.body.userId}!`;
      res.send(response);
    }
    res.send(parsedResponse);
  }
});
  
app.post('/queryByKey', async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);

  let networkObj = await network.connectToNetwork(appAdmin);
  console.log('after network OBj');
  let response = await network.invoke(networkObj, true, 'readMyAsset', req.body.key);
  response = JSON.parse(response);
  if (response.error) {
    console.log('inside eRRRRR');
    res.send(response.error);
  } else {
    console.log('inside ELSE');
    res.send(response);
  }
  
});
  
  
app.listen(process.env.PORT || 8081);