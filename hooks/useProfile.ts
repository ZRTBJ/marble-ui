import axios from 'axios'
import { backend_url } from 'util/constants'

export const getProfileInfo = async (address) => {
  try {
    const { data } = await axios.get(`${backend_url}/get_user`, {
      params: { id: address },
    })
    return data
  } catch (err) {
    console.log('get profile info: ', err)
    return {}
  }
}

export const setImage = async (imageData) => {
  try {
    const { data } = await axios.post(`${backend_url}/set_image`, imageData)
    return data
  } catch (err) {
    console.log('set profile image: ', err)
    return {}
  }
}

export const setProfileInfo = async (profileData) => {
  try {
    const { data } = await axios.post(
      `${backend_url}/register_user`,
      profileData
    )
    return data
  } catch (err) {
    console.log('register profile info error: ', err)
    return false
  }
}

export const getAllUsers = async () => {
  try {
    const { data } = await axios.get(`${backend_url}/get_all_users`)
    return data
  } catch (err) {
    console.log('get all users error: ', err)
    return []
  }
}

export const fetchAllProfileCounts = async () => {
  try {
    const { data } = await axios.get(`${backend_url}/number_infos`)
    return data
  } catch (err) {
    console.log('get all users count error: ', err)
    return {}
  }
}

export const controlFollow = async (req) => {
  try {
    const { data } = await axios.post(`${backend_url}/control_follow`, req)
    return data
  } catch (err) {
    console.log('handle control follow error: ', err)
    return false
  }
}
