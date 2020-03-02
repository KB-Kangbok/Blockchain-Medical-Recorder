import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: `http://10.0.2.15:8081`
  })
}