import axios from 'axios'
// import { base } from '../../../blogListBackend/models/blog'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}


const getAll = async() => {
  const response = await axios.get(baseUrl)
  return response.data
}


const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const updateUrl = `${baseUrl}/${newObject.id}`
  const response = await axios.put(updateUrl, newObject, config)
  return response.data
}

const deleteById = async id => {
  const config = {
    headers: { Authorization: token },
  }
  const deleteUrl = `${baseUrl}/${id}`
  await axios.delete(deleteUrl, config)
}

export default { getAll ,setToken, create, update, deleteById }