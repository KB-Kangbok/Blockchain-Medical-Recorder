'use strict';

// Import Hyperledger Fabric
const { Contract } = require('fabric-contract-api');

// Import files with constructor
let User = require('./User');
let Record = require('./Record');

class MyAssetContract extends Contract {
    async init(ctx){
        console.log('instantiate called');

        let users = [];
        let records = [];

        //create user
        let user1 = await new User('user1', 'patient', 'KB', 'Lee', '1234', records, ['user1']);

        //update user array
        users.push(user1);

        //add the user to the world state
        await ctx.stub.putState(user1.userId, Buffer.from(JSON.stringify(user1)));
        
        return users;
    }

    async createUser(ctx, args){

        args = JSON.parse(args);

        //create new user
        let newUser = await new User(args.userId, args.userType, args.firstName, args.lastName, args.password, [], [args.userId]);

        //update state with new user
        await ctx.stub.putState(newUser.userId, Buffer.from(JSON.stringify(newUser)));
    }

    async readUser(ctx, userId) {
        //check if user exists
        const exists = await this.myAssetExists(userId);
        if(!exists){
            let response = {}
            response.error = `User with ${userId} does not exist`;
            return response;
        }

        //get user data from ctx
        let userData = await this.readMyAsset(ctx, userId);
        let user = await new User(userData.userId, userData.userType, userData.firstName, userData.lastName, userData.records, userData.observableId);

        return user;
    }

    async createRecord (ctx, args){
        
        args = JSON.parse(args);

        //create new record
        let newRecord = await new Record(ctx, args.patientId, args.date, args.symptom, args.medication, args.doctorName, args.description);

        //check if patient exists
        const exists = await this.myAssetExists(ctx, args.patientId);

        if(!exists) {
            let response = {};
            response.error = `Patient with ${args.patientId} does not exist`;
            return response;
        }

        //get user object
        let user = await this.readMyAsset(ctx, args.patientId);

        //set reference to user
        user.records.push(newRecord.recordId);

        //update state with new user
        await ctx.stub.putState(newRecord.recordId, Buffer.from(JSON.stringify(newRecord)));
        await ctx.stub.putState(user.userId, Buffer.from(JSON.stringify(user)));
    }

    async deleteRecord(ctx, args){
        args = JSON.parse(args);

        //check if record exists
        const exists = await this.myAssetExists(ctx, args.recordId);
        if(!exists){
            let response = {};
            response.error = `Record ${args.recordId} does not exist`;
            return response;
        }

        let record = await this.readMyAsset(ctx, args.recordId);

        //get patient data and delete record data in patient data
        let patient = await this.readMyAsset(ctx, record.patientId);
        let idx = patient.records.indexOf(args.recordId);
        await patient.records.splice(idx,1);

        //delete record and update patient
        await this.deleteMyAsset(ctx,args.recordId);
        await ctx.stub.putState(patient.userId, Buffer.from(JSON.stringify(patient)));
    }

    //give doctor auth to look for patient records
    async giveAuth(ctx, args){
        args = JSON.parse(args);

        let doctor = await this.readMyAsset(ctx, args.doctorId);
        
        //check if doctor already has auth
        let idx = await doctor.observableId.indexOf(args.patientId);
        if(idx !== -1) {
            response = {};
            response.error = `Doctor already has auth to ${args.patientId}`;
            return response;
        }

        await doctor.observableId.push(args.patientId);
        
        await ctx.stub.putState(doctor.userId, Buffer.from(JSON.stringify(doctor)));
    }

    //remove doctor's auth to see patient's records
    async removeAuth(ctx, args){
        args = JSON.parse(args);

        let doctor = await this.readMyAsset(ctx, args.doctorId);

        //check if doctor has auth
        const idx = doctor.observableId.indexOf(args.patientId);
        if(idx === -1) {
            let response = {};
            response.error = `Doctor already does not have auth to ${args.patientId}`;
            return response;
        }

        await doctor.observableId.splice(idx,1);

        await ctx.stub.putState(doctor.userId, Buffer.from(JSON.stringify(doctor)));
    }

    async validateAuth (ctx, args){
        args = JSON.parse(args);
        let user = await this.readMyAsset(ctx, args.userId);

        const idx = user.observableId.indexOf(args.patientId);
        return (idx!==-1);        
    }

    async queryRecords (ctx, args){
        
        //check if user has auth to query record
        const auth = await this.validateAuth(ctx, args);
        if(!auth){
            let response = {};
            response.error = `The user ${args.userId} does not have authentication to see records of ${args.patientId}`;
            return response;
        }
        
        //get patient data to get access to record
        args = JSON.parse(args);
        let patient = await this.readMyAsset(ctx, args.patientId);
        
        //check if patient has any record
        if(!patient.records || patient.records.length <= 0){
            let response = {};
            response.error = `The user ${args.userId} does not have authentication to see records of ${args.patientId}`;
            return response;
        }

        let allResults = [];
        var i;
        for (i = 0; i < patient.records.length; i++){
            let record = await this.readMyAsset(ctx, patient.records[i]);
            allResults.push(record);
        }

        return JSON.stringify(allResults)
    }

    async readMyAsset(ctx, myAssetId) {

        const exists = await this.myAssetExists(ctx, myAssetId);
    
        if (!exists) {
            // throw new Error(`The my asset ${myAssetId} does not exist`);
            let response = {};
            response.error = `The my asset ${myAssetId} does not exist`;
            return response;
        }
    
        const buffer = await ctx.stub.getState(myAssetId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }
    
    async deleteMyAsset(ctx, myAssetId) {

        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
    
        await ctx.stub.deleteState(myAssetId);
    
    }
    
    async myAssetExists(ctx, myAssetId) {

        const buffer = await ctx.stub.getState(myAssetId);
        return (!!buffer && buffer.length > 0);
    
    }
    
    async queryWithQueryString(ctx, queryString){
        console.log('query String');
        console.log(JSON.stringify(queryString));

        let resultsIterator = await ctx.stub.getQueryResult(queryString);

        let allResults = [];
        while (true) {
            let res = await resultsIterator.next();
      
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
      
                console.log(res.value.value.toString('utf8'));
      
                jsonRes.Key = res.value.key;
      
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
      
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await resultsIterator.close();
                console.info(allResults);
                console.log(JSON.stringify(allResults));
                return JSON.stringify(allResults);
            }
        }
      
    }

    async queryByObjectType(ctx, objectType){
        let queryString = {
            selector: {
                type:objectType
            }
        };

        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    }

    
}

module.exports = MyAssetContract;