import { PROFILE_STATUS } from '../types'
import axios from 'axios'
import { backend_url } from 'util/constants'

export const getProfileData = (address, dispatch) => {
  axios
    .get(`${backend_url}/get_user`, { params: { id: address } })
    .then(({ data }) => {
      dispatch({
        type: PROFILE_STATUS,
        payload: data,
      })
    })
    .catch((err) => {
      console.log('get_user_error: ', err)
    })
}

export const createProfileData = (
  profileInfo,
  dispatch,
  successCallback = () => {},
  failCallback = () => {}
) => {
  axios
    .post(`${backend_url}/register_user`, profileInfo)
    .then(({ data }) => {
      dispatch({
        type: PROFILE_STATUS,
        payload: data,
      })
    })
    .catch((err) => {
      console.log('create_user_error: ', err)
    })
}
