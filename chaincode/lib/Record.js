'use strict';

class Record {
  constructor(ctx, patientId, date, symptom, medication, doctorName, description){
    this.patientId = patientId;
    this.date = date;
    this.symptom = symptom;
    this.medication = medication;
    this.doctorName = doctorName;
    this.description = description;
    this.recordId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.type = 'record';

    if (this.__isContract) {
      delete this.__isContract;
    }
    if (this.name) {
      delete this.name;
    }
    return this;
  }
}

module.exports = Record;