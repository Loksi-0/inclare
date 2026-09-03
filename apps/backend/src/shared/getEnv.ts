const getEnv = (name: string) => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`missing ${name} in .env file`)
  }

  return value
}

export default getEnv
