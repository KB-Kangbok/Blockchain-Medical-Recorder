'use strict';

class User {
  constructor(userId, userType, firstName, lastName, records, observableId){
    this.userId = userId;
    this.userType = userType;
    this.firstName = firstName;
    this.lastName = lastName;
    this.observableId = observableId;
    this.records = records;
    this.type = 'user';

    if (this.__isContract) {
      delete this.__isContract;
    }
    if (this.name) {
      delete this.name;
    }
    return this;
  }

  async deleteRecord(recordId){
    let idx = this.records.indexOf(recordId);

    this.records.splice(idx,1);
  }

  async deleteAuth(patientId){
    let idx = this.observableId.indexOf(patientId);

    this.observableId.splice(idx,1);
  }
}

module.exports = User;