import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { checkPassword } from "../hash";
import { Bearer } from "permit";
import { hashPassword } from "../hash";
import { User } from "../models";
import jwtSimple from "jwt-simple";
import { env } from "../env";

const permit = new Bearer({
    query:"access_token"
  })

  export class UserController {
    constructor(private userService: UserService) {}

    register = async (req: Request, res: Response) => {
        try {
          const { username, password, usertype } = req.body;
          const hashedPassword = await hashPassword(password);
        //   const DbUser: User | undefined = await this.userService.getUserByUsername(
        //     username
        //   );
    
        //   if (!username || username.length < 3) {
        //     res.status(401).json({ message: "Wrong username" });
        //     return;
        //   }
        //   if (!password || password.length < 8) {
        //     res.status(401).json({ message: "Wrong password" });
        //     return;
        //   }
        //   if (!confirmPassword || confirmPassword != password) {
        //     res.status(401).json({ message: "Wrong confirm password" });
        //     return;
        //   }
        //   if (username === DbUser) {
        //     res.status(401).json({ message: "Username is duplicate" });
        //     return;
        //   }
    
          const user: any = await this.userService.createUser(
            username,
            hashedPassword,
            usertype,
          );
          // res.json(user);
          if (user) {
            console.log(user);
            const payload = { id: user.id, username: user.username };
            const token = jwtSimple.encode(payload, env.JWT_SECRET);
            res.json(token);
            console.log(token);
            return;
          }
        } catch (error:any) {
          res.status(500).json({ message: error.detail });
          return;
        }
      };
    
      login = async (req: Request, res: Response) => {
        try {
          const { username, password } = req.body;
          const user: User | undefined = await this.userService.getUserByUsername(
            username
          );
    
          if (!user) {
            res.status(401).json({ message: "Wrong username" });
            return;
          }
    
          if (user && !(await checkPassword(password, user.password))) {
            res.status(401).json({ message: "Wrong password" });
            return;
          }
    
          const payload = { id: user.id, username: user.username };
          const token = jwtSimple.encode(payload, env.JWT_SECRET);
          res.json(token);
          return;
        } catch (e) {
          res.status(500).json({ message: e });
          return;
        }
      };

      getAllUsername = async (req: Request, res: Response) => {
        try {
            const user: any = await this.userService.getAllUsername();
            res.json(user)
        }catch(error){
            res.status(500).json({ message: error });
            return;
        }
      }

      getUserById = async(req:Request, res: Response) => {
        try {
            const user: any = await this.userService.getUsernameById(req.params.id);
            res.json(user)
        }catch(error){
            res.status(500).json({ message: error });
            return;
        }
      }

      permissions = async (req: Request, res: Response) => {
        try {
            const { username, permissionsLevel } = req.body;
            console.log(username, permissionsLevel)
            const user: any = await this.userService.permissions(username,permissionsLevel);
            res.json(user)
        }catch(error){
            res.status(500).json({ message: error });
            return;
        }
      }

      authority = async (req: Request, res: Response) => {
        try {
            const { username, authorityLevel } = req.body;
            console.log(username, authorityLevel)
            const user: any = await this.userService.authority(username,authorityLevel);
            res.json(user)
        }catch(error){
            res.status(500).json({ message: error });
            return;
        }
      }

      postPolicy  = async (req: Request, res: Response)=>{
        try {
            const { policyNumber, policyType, policyTerm, coverageAmount, premium} = req.body;
            const user: any = await this.userService.postPolicy(policyNumber, policyType, policyTerm, coverageAmount, premium);
            res.json(user)
        }catch(error){
            res.status(500).json({ message: error });
            return;
        }
      }

      getAllPolicy = async (req: Request, res: Response) => {
        try {
            const user: any = await this.userService.getAllPolicy();
            res.json(user)
        }catch(error){
            res.status(500).json({ message: error });
            return;
        }
      }

      editPolicy = async (req: Request, res: Response) => {
        try {
            const {policyId,
                policyNumber,
                policyType,
                policyTerm,
                coverageAmount,
                premium} = req.body
            const user: any = await this.userService.editPolicy(policyId,policyNumber,policyType,policyTerm,coverageAmount,premium);
            res.json(user)
        }catch(error){
            res.status(500).json({ message: error });
            return;
        }
      }

      deletePolicy = async (req: Request, res: Response) => {
        try {
            const policyId = req.body.policyId
            const user: any = await this.userService.deletePolicy(policyId);
            res.json(user)
        }catch(error){
            res.status(500).json({ message: error });
            return;
        }
      }
}