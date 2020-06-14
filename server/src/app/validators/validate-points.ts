import { celebrate, Joi, Segments } from 'celebrate'

const validateItems = (value: string, helpers: any) => {
  const items = value.split(',')
  const uuidMaskV4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

  return items.every((item) => (item.trim().match(uuidMaskV4) ? true : false))
    ? value
    : helpers.message({
        custom: 'The items parameter must be UUID v4 separed by ","',
      })
}

const validatePhoneNumber = (phone: string, helpers: any) => {
  const phoneMask = /^\+?([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/

  return phone.match(phoneMask)
    ? phone
    : helpers.message({
        custom: 'The phone number must be format "+#############"',
      })
}

export function validateGetById() {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  })
}

export function validateGetAll() {
  return celebrate(
    {
      [Segments.QUERY]: Joi.object().keys({
        uf: Joi.string().length(2).uppercase().required(),
        city: Joi.string().max(45).required(),
        items: Joi.string().custom(validateItems).optional(),
      }),
    },
    {
      abortEarly: false,
    }
  )
}

export function validateCreateNewPoint() {
  return celebrate(
    {
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().max(255).required(),
        email: Joi.string().email().max(100).required(),
        whatsapp: Joi.string().max(20).custom(validatePhoneNumber).required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().max(45).required(),
        uf: Joi.string().length(2).uppercase().required(),
        items: Joi.string().custom(validateItems).required(),
      }),
    },
    {
      abortEarly: false,
    }
  )
}
