import { hash,compare } from 'bcryptjs'
import {Request, Response} from 'express'
import { IAuthentication, IUser } from '../interface/IUser'
import { prismaClient } from '../database/prismaClient'
import { sign } from 'jsonwebtoken'
import config from "../config"

const generateToken = (params:string)=>sign(params,config.SECRET,{expiresIn: 30})

export class AuthController {

  async register(request:Request,response:Response){
    const {name,email,password}:IUser = request.body

    const new_password = await hash(password,10) 

    await prismaClient.user.create({
      data:{
        email,
        name,
        password:new_password}
    })

    return response.status(201).json()
  }

  async authentication(request:Request,response:Response){
    const {email, password}:IAuthentication = request.body

    let exist_email = await prismaClient.user.findFirst({where:{email}})

    if(!exist_email)
      return response.status(400).json('Incorrect email and/or password!')

    compare(password, exist_email.password,(err,result)=>{
      if(!result)
        return response.status(400).json('Incorrect email and/or password!')
    })

    const token = generateToken(exist_email.id)

    return response.status(200).json({...exist_email,token:`Bearer ${token}`})
    
  }
  
}