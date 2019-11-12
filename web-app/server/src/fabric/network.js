'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');

//connect to the config file
const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
// let userName = config.userName;
let gatewayDiscovery = config.gatewayDiscovery;
let appAdmin = config.appAdmin;
let orgMSPID = config.orgMSPID;

//connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const util = require('util');

exports.connectToNetwork = async function (userName) {

  const gateway = new Gateway();

  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet Path: ${walletPath}`);
    console.log(`userName: ${userName}`);

    console.log(`wallet: ${util.inspect(wallet)}`);
    console.log(`ccp: ${util.inspect(ccp)}`);

    const userExists = await wallet.exists(userName);
    if (!userExists){
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      console.log(`Run the registerUser.js application before retrying`);
      let response = {};
      response.error = `An identity for the user ${userName} does not exist in the wallet. Register ${userName} first`;
      return response;
    }

    console.log('before gateway.connect: ');

    await gateway.connect(ccp, {wallet, identity: userName, discovery: gatewayDiscovery});

    //Connect to local fabric
    const network = await gateway.getNetwork('mychannel');

    console.log('Connect to mychannel.');
    //Get the contract installed on the peer
    const contract = await network.getContract('medicalContract');

    let networkObj = {
      contract: contract,
      network: network,
      gateway: gateway
    };

    return networkObj;
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  } finally {
    console.log('Done connecting to network');
  }
};

exports.invoke = async function (networkObj, isQuery, func, args){
  try {
    console.log('inside invoke');
    console.log(`isQuery: ${isQuery}, func: ${func}, arges: ${args}`);
    console.log(util.inspect(networkObj));

    if(isQuery === true){
      console.log('inside isQuery');

      if(args){
        console.log('inside isQuery, args');
        console.log(args);
        let response = await networkObj.contract.evaluateTransaction(func, args);
        console.log(response);
        console.log(`Transaction ${func} with args ${args} has been evaluated`);

        await networkObj.gateway.disconnect();

        return response;
      } else {
        let response = await networkObj.contract.evaluateTransaction(func);
        console.log(response);
        console.log(`Transaction ${func} without args has been evaluated`);

        await networkObj.gateway.disconnect();

        return response;
      }
    } else {
      console.log('notQuery');
      if (args){
        console.log('notQuery, args');
        console.log('$$$$$$$$$$$$$ args: ');
        console.log(args);
        console.log(func);
        console.log(typeof args);

        args = JSON.parse(args[0]);

        console.log('before submit');
        console.log(util.inspect(networkObj));
        let response = await networkObj.contract.submitTransaction(func, args);
        console.log('after submit');

        console.log(response);
        console.log(`Transaction ${func} with args ${args} has been submitted`);

        await networkObj.gateway.disconnect();

        return response;
      } else {
        let response = await networkObj.contract.submitTransaction(func, args);
        console.log(response);
        console.log(`Transaction ${func} without args has been submitted`);

        await networkObj.gateway.disconnect();

        return response;
      }
    }
  } catch(error){
    console.log(`Failed to submit transaction: ${error}`);
    return error;
  }
};

exports.registerUser = async function(userId, userType, firstName, lastName){

  console.log('registrarId');
  console.log(userType);

  console.log('userId');
  console.log(userId);

  if (!userType || !userId || !firstName || !lastName){
    let response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  try {

    // Create a new file system based wallet for managing identities
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log(wallet);

    // Check to see if user already exists
    const userExists = await wallet.exists(userId);
    if (userExists){
      let response = {};
      console.log(`An identity for ${userId} already exists in the wallet`);
      response.error = `Error! An identity for ${userId} already exists in the wallet. Please enter a different id.`;
      return response;
    }

    // Check to see if admin exists
    const adminExists = await wallet.exists(appAdmin);
    if (!adminExists) {
      let response = {};
      console.log(`An identity for the admin user ${appAdmin} does not exist in the wallet`);
      console.log('Run enrollAdmin.js application before retrying');
      response.error = `Error! An identity for the admin user ${appAdmin} does not exist in the wallet
        Run enrollAdmin.js application before retrying`;
      return response;
    }

    // Create a new gateway for connecting to peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {wallet, identity: appAdmin, discovery: gatewayDiscovery});

    // Get the CA client object from the gateway for interacting with CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();
    console.log(`AdminIdentity: ${adminIdentity}`);

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({affiliation: 'org1', enrollmentID: userId, role: 'client'}, adminIdentity);

    const enrollment = await ca.enroll({enrollmentID: userId, enrollmentSecret: secret});
    const userIdentity = await X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
    await wallet.import(userId, userIdentity);
    console.log(`Successfully registered user ${firstName} ${lastName}. Use UserId ${userId} to login.`);
    let response = `Successfully registered user ${firstName} ${lastName}. Use UserId ${userId} to login.`;
    return response;
  } catch(error){
    console.error(`Failed to register user ${userId} : ${error}`);
    let response = {};
    response.error = error;
    return response;
  }
};