
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import { Users } from '../entity/Users';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { validate } from 'class-validator';
import {transporter} from '../config/mailer'


class AuthController {

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
    
        if (!(email && password)) {
          return res.status(400).json({ message: ' Username & Password are required!' });
        }
    
        const userRepository = getRepository(Users);
        let user: Users;
    
        try {
          user = await userRepository.findOneOrFail({ where: { email } });
        } catch (e) {
          return res.status(400).json({ message: ' email or password incorecct!' });
        }
    
        // Check password
        if (!user.checkPassword(password)) {
          return res.status(400).json({ message: 'email or Password are incorrect!' });
        }
    
        const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });
    
        res.json({ message: 'OK', token, userId: user.id, role: user.role });
      };
   
    
      static changePassword = async (req: Request, res: Response) => {
        const { userId } = res.locals.jwtPayload;
        const { oldPassword, newPassword } = req.body;
    
        if (!(oldPassword && newPassword)) {
          res.status(400).json({ message: 'Old password & new password are required' });
        }
    
        const userRepository = getRepository(Users);
        let user: Users;
    
        try {
          user = await userRepository.findOneOrFail(userId);
        } catch (e) {
          res.status(400).json({ message: 'Somenthing goes wrong!' });
        }
    
        if (!user.checkPassword(oldPassword)) {
          return res.status(401).json({ message: 'Check your old Password' });
        }
    
        user.password = newPassword;
        const validationOps = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOps);
       
        if (errors.length > 0) {
          return res.status(400).json(errors);
        }
    
        // Hash password
        user.hashPassword();
        userRepository.save(user);
    
        res.json({ message: 'Password change!' });
      };



    

  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    if(!(email)){
        return res.status(400).json({message: 'Username is required!'});
    }
    const message = 'Check your email for a link to reset your password.';
    let verificationLink;
    let emailStatus = 'ok';  

    const userRepository= getRepository(Users);
    let user: Users;
    try{
        user = await userRepository.findOneOrFail({where:{email: email}});
        const token = jwt.sign({userId: user.id, email: user.email}, config.jwtSecretReset, {expiresIn:'10m'});
        
        verificationLink= `http://localhost:3000/auth/new-password/${token}`;
        user.resetToken = token;
        
         
    }catch(error){
        return res.json({message});
    }
   // envia de email
    try {
      
      let info = await transporter.sendMail({
    from: '"Forgot password👻" <ar.test.paredes@gmail.com>', // sender address
    to: user.email ,
    subject: "Forgot password ✔ ", // Subject line
    html: `b>Please click on the following link, or paste this into your browser to complete process: </b>
    <a href="${verificationLink}">${verificationLink}</a>`, // html body
  });
  console.log("Message sent: %s", info.messageId);

    } catch (error) {
        emailStatus=error;
        return res.status(400).json({message :'Something'});
    }

    try {
        await userRepository.save(user)
    } catch (error) {
        return res.status(400).json({message: 'something goes wrong'});

    }

    res.json({message, info: emailStatus, test: verificationLink });




};

static createNewPassword = async(req: Request, res: Response) =>{
    const { newPassword } = req.body;
    const resetToken = req.headers.reset as string;
    if(!(resetToken && newPassword))
    {

        res.status(400).json({message: 'All the are required'});
    
    }
    const userRepository= getRepository(Users);
     let jwtPayload;
     let user : Users;
     try {
         jwtPayload = jwt.verify(resetToken, config.jwtSecretReset);
         user = await userRepository.findOneOrFail({where:{resetToken}});
     } catch (error) {
         return res.status(400).json({message: 'Someting goes wrogt'});

     }

     user.password = newPassword;
     const validationOps = { validationError: { target: false, value: false } };
     const errors = await validate(user, validationOps);
    

     if (errors.length > 0){
         return res.status(400).json(errors);
     }
     try {
         user.hashPassword();
         await userRepository.save(user);
         
     } catch (error) 
     {
     
        return res.status(400).json({message: 'someting goes wrong'});

     }
      
          res.json({message: 'Password change'});
};

}
export default AuthController;