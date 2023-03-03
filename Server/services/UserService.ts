import { Knex } from "knex";
// import { User } from "../models";

export class UserService {
  constructor(private knex: Knex) {}
  async createUser(username: string, password: string, userType:string) {
    console.log(username,password,userType)
    let permissionsLevel = 1
    let authorityLevel = 1
    if (userType === "Admin"){
        permissionsLevel = 5
    }else if(userType === "Agent"){
        permissionsLevel = 1
    }
    const user = (
      await this.knex("users").insert({ username, password, userType, permissionsLevel,authorityLevel }).returning("*")
    )[0];
  }

  async getUserByUsername(username: string) {
    const user = await this.knex("users")
      .where({ username: username })
      .first();
    return user;
  }

  async getAllUsername(){
      const user = await this.knex("users").orderBy('id')
      return user
  }

  async getUsernameById(userId:string){
    const user = await this.knex("users").where({"id":userId})
    return user
  }

  async permissions(username:string,permissions:string){
    // console.log('user',username,'permit',permissions)
    const user = await this.knex("users").update({"username" : username,"permissionsLevel":permissions}).where({ "username": username });
    return user
  }

  async authority (username:string,authority:string){
    const user = await this.knex("users").update({"username" : username,"authorityLevel":authority}).where({ "username": username });
    return user
  }

  async postPolicy(userId:number | undefined,policyNumber:string, policyType:string, policyTerm:string, coverageAmount:string, premium:string, claims:string){
    console.log(userId,policyNumber, policyType, policyTerm, coverageAmount, premium, claims)
    const user = await this.knex("policy").insert({"user_id":userId,"policy_number" : policyNumber,"policy_type":policyType,"policy_term":policyTerm,"coverage_amount":coverageAmount,"premium":premium,"claims_amount":claims});
    console.log(user)
    return user
  }

  // async getAllPolicy(){
  //   const user = await this.knex("policy").orderBy('id')
  //   return user
  // }

  async getAllPolicy(){
    const result = await this.knex.raw(`
      select policy.*,users.username 
      from policy left join users on user_id = users.id
      order by id;
    `);
    return result.rows;
  }

  async editPolicy(policyId:string,policyNumber:string,policyType:string, policyTerm:string, coverageAmount:string, premium:string){
    const user = await this.knex("policy").update({"policy_number" : policyNumber,"policy_type":policyType,"policy_term":policyTerm,"coverage_amount":coverageAmount,"premium":premium}).where({ "id" : policyId});
    return user
  }

  async deletePolicy(policyId:string){
    await this.knex("policy").where("id",policyId).del()
  }

  async getUserById(userId : number | undefined){
    const user = await this.knex("users")
    .where({ id: userId })
    .first();
  return user;
  }
}