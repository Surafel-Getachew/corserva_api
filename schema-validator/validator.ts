const validator = (schema: any) => (payload: any) => {
  return schema.validate(payload, { abortEarly: false })
}

export default validator
