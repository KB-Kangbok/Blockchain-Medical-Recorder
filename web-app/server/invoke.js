/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const network = require('./src/fabric/network.js');

async function main() {
  try {
    let networkObj = await network.connectToNetwork('admin');
    // let args = {
    //     userId:'user2',
    //     userType:'doctor',
    //     firstName:'Satirev',
    //     lastName:'Kyle'
    // };
    // let response = await network.invoke(networkObj,false,'createUser',[JSON.stringify(args)]);

    let response = await network.invoke(networkObj, true, 'queryByObjectType', 'user');

    // let args = {
    //     patientId:'user1',
    //     date:'2019-09-11',
    //     symptom:'depression',
    //     medication:'tylenol',
    //     doctorName:'Satirev',
    //     description:''
    // }
    // let response = await network.invoke(networkObj, false, 'createRecord', [JSON.stringify(args)]);

    // let response = await network.invoke(networkObj, true, 'readMyAsset', 'user1');

    // let args = {
    //   doctorId: 'user2',
    //   patientId: 'user1'
    // }
    // let response = await network.invoke(networkObj, false, 'giveAuth', [JSON.stringify(args)]);

    // let args = {
    //   userId: 'user2',
    //   patientId: 'user1'
    // };
    // let response = await network.invoke(networkObj, true, 'queryRecords', JSON.stringify(args));

    // let args = { recordId: '2otq5hzgbg1cut7ijm36xq'}
    // let response = await network.invoke(networkObj, false, 'deleteRecord', [JSON.stringify(args)]);

    // let args = {
    //   doctorId: 'user2',
    //   patientId: 'user1'
    // }
    // let response = await network.invoke(networkObj, false, 'removeAuth', [JSON.stringify(args)]);

    console.log(response.toString());
  } catch (error) {
    console.error(`Failed to enroll admin user ' + ${appAdmin} + : ${error}`);
    process.exit(1);
  }
}

main();