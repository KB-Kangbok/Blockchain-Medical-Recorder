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

//get all assets in world state;
app.get('/queryAll', async (req, res) => {

  let networkObj = await network.connectionToNetwork(appAdmin);
  let response = await network.invoke(networkObj, true, 'queryAll', '');
  let parsedResponse = await JSON.parse(response);
  res.send(parsedResponse);

});

//query for certain objects within the world state
app.post('/queryWithQueryString', async (req, res) => {

  let networkObj = await network.connectToNetwork(appAdmin);
  let response = await network.invoke(networkObj, true, 'queryByObjectType', req.body.selected);
  let parsedResponse = await JSON.parse(response);
  res.send(parsedResponse);

});

//get user info, create user object, and update state with their userId
app.post('/registerUser', async (req, res) => {

  console.log('req.body: ');
  console.log(req.body);
  let userId = req.body.userId;

  //first create the identity for the user and add to wallet
  let response = await network.registerUser(userId, req.body.registrarId, req.body.firstName, req.body.lastName);
  console.log('response from registerUster: ');
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
    //connect to network and update the state with voterId  

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

  // let invokeResponse = await network.invoke(networkObj, true, 'readMyAsset', req.body.userId);
  // if (invokeResponse.error) {
  //   res.send(invokeResponse);
  // } else {
  //   console.log('after network.invoke ');
  //   let parsedResponse = await JSON.parse(invokeResponse);
  //   if (parsedResponse.ballotCast) {
  //   let response = {};
  //   response.error = 'This voter has already cast a ballot, we cannot allow double-voting!';
  //   res.send(response);
  //   }
  //   res.send(parsedResponse);
  // }

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