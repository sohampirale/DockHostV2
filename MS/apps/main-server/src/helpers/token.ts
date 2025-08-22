import jwt from "jsonwebtoken"

export function generateUserAccessToken(payload:any,expiresIn="1d"){
  const token = jwt.sign(payload,process.env.USER_ACCESS_TOKEN_SECRET!,{
    expiresIn
  })
  return token;
}

export function generateBackendAccessToken(payload:any,expiresIn='30d'){
  const token = jwt.sign(payload,process.env.BACKEND_ACCESS_TOKEN_SECRET!,{
    expiresIn
  })
  return token;
}