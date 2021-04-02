import {Router} from 'express'
import axios from 'axios'
import validate from 'express-validation'
import token from '../../token'

import validation from './validation'

import { generateUser, generateUsers } from "./userHelper";

axios.defaults.baseURL = 'https://api.github.com/'
axios.defaults.headers.common['Authorization'] = token

export default () => {
  let router = Router()

  /** GET /health-check - Check service health */
  router.get('/health-check', (req, res) => res.send('OK'))

  /** GET /api/rate_limit - Get github rate limit for your token */
  router.get('/rate', (req, res) => {
    axios.get(`rate_limit`).then(({ data }) => res.json(data))
  })

  /** GET /api/user/:username - Get user */
  router.get('/user/:username', validate(validation.user), (req, res) => {
      generateUser(req.params.username, res)
  })

  /** GET /api/users? - Get users */
  router.get('/users/', validate(validation.users), (req, res) => {
      generateUsers(req.query, res)
  })

  return router
}
