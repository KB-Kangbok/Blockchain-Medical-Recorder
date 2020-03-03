import Api from "../services/api"

export default {
  queryRecords(userId, patientId){
    return Api().post('queryRecords', {
      userId: userId,
      patientId: patientId
    })
  },
  giveAuth(userId, doctorId){
    return Api().post('giveAuth', {
      patientId: userId,
      doctorId: doctorId
    })
  },
  removeAuth(userId, doctorId) {
    return Api().post('removeAuth', {
      patientId: userId,
      doctorId: doctorId
    })
  },
  createRecord(userId, patientId, date, symptom, medication, doctorName, description){
    return Api().post('createRecord', {
      userId: userId,
      args: {
        patientId: patientId,
        date: date,
        symptom: symptom,
        medication: medication,
        doctorName: doctorName,
        description: description
      }
    })
  },
  deleteRecord(userId, recordId) {
    return Api().post('deleteRecord', {
      userId: userId,
      args: {
        recordId: recordId
      }
    })
  },
  registerUser(userId, userType, firstName, lastName, password) {
    return Api().post('registerUser', {
      userId: userId,
      userType: userType,
      firstName: firstName,
      lastName: lastName,
      password: password
    }) 
  },
  validateUser(userId, password) {
    return Api().post('validateUser', {
      userId: userId,
      password:password
    }) 
  },
  queryByObjectType() {
    return Api().get('queryByObjectType')
  },
  queryWithQueryString(selected) {
    return Api().post('queryWithQueryString', {
      selected: selected
    }) 
  },
  queryByKey(key) {
    return Api().post('queryByKey', {
      key: key
    }) 
  }
}