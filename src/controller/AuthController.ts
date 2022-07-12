import { hash, compare } from 'bcryptjs'
import { Request, Response } from 'express'
import { IAuthentication, IUser } from '../interface/IUser'
import { prismaClient } from '../database/prismaClient'
import { sign } from 'jsonwebtoken'
import config from '../config'

// const generateToken = (params:string) => sign(params, config.SECRET, { expiresIn: 30 })
export class AuthController {
  async register (request:Request, response:Response) {
    const { name, email, password } :IUser = request.body
    const newPassword = await hash(password, 10)
    await prismaClient.user.create({
      data: {
        email,
        name,
        password: newPassword
      }
    })

    return response.status(201).json()
  }

  async authentication (request:Request, response:Response) {
    const { email, password }:IAuthentication = request.body

    const existEmail = await prismaClient.user.findFirst({ where: { email } })

    if (!existEmail) {
      return response.status(400).json('Incorrect email and/or password!')
    }

    compare(password, existEmail.password)

    const token = sign({ id: existEmail.id }, config.SECRET, { expiresIn: '1m' })

    return response.status(200).json({ ...existEmail, token: `Bearer ${token}` })
  }
}
