'use strict';

const Contract = require('fabric-contract-api');

class patientContract extends Contract {
    async queryAllPatients (ctx){
        
    }
    async queryPatient (ctx, patientId){

        let recordsAsBytes = await ctx.stub.getState(patientId);
        if(!recordsAsBytes || recordsAsBytes.toString().length <= 0){
            throw new Error('Patient with this Id does not exist: ');
        }
        let records = JSON.parse(recordsAsBytes.toString());
        return JSON.stringify(records);
    }

    async addPatient (ctx, patientId, date, name){
        
        let patient = {
            name:name,
            date:date
        }

        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)));

        console.log('Patient added to the ledger successfully');
    }

    async deletePatient (ctx, patientId){

        await ctx.stub.deleteState(patientId);
        console.log('Patient deleted from the ledger successfully');
    }
}

module.exports = patientContract;