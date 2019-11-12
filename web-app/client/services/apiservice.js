import Api from '@/services/api';

export default {
  queryAll() {
    return Api().get('queryAll')
  },
  queryByObjectType() {
    return Api().get('queryByObjectType')
  },
  queryWithQueryString(selected) {
    return Api().post('queryWithQueryString', {
      selected: selected
    }) 
  },
  registerUser(userId, userType, firstName, lastName) {
    return Api().post('registerUser', {
      userId: userId,
      userType: userType,
      firstName: firstName,
      lastName: lastName,
      
    }) 
  },
  validateUser(userId) {
    return Api().post('validateVoter', {
      userId: userId
    }) 
  },
  queryByKey(key) {
    return Api().post('queryByKey', {
      key: key
    }) 
  }
}