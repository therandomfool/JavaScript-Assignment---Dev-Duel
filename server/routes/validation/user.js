import Joi from 'joi'

export default {
  params: {
    username: Joi.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*$/).required().min(1).max(39)
  }
}
