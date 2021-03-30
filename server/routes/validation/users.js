import Joi from 'joi'

export default {
  query: {
    username: Joi.array().items(Joi.string()).single().required()
  }
}
