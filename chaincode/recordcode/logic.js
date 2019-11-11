'use strict';

const Contract = require('fabric-contract-api');

class recordContract extends Contract {
    async queryRecords (ctx, patientId){

        let recordsAsBytes = await ctx.stub.getState(patientId);
        if(!recordsAsBytes || recordsAsBytes.toString().length <= 0){
            throw new Error('Patient with this Id does not exist: ');
        }
        let records = JSON.parse(recordsAsBytes.toString());
        return JSON.stringify(records);
    }

    async addRecords (ctx, patientId, date, symptom, medication){
        
        const record = {
            date,
            symptom,
            medication
        };

        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(record)));
    }
}

module.exports = recordContract;