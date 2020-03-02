import Api from "../services/api"

export default {
  queryByObjectType() {
    return Api().get('queryByObjectType')
  },
  queryWithQueryString(selected) {
    return Api().post('queryWithQueryString', {
      selected: selected
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
  queryByKey(key) {
    return Api().post('queryByKey', {
      key: key
    }) 
  }
}