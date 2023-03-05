import { Request, Response } from "express";
import { Knex } from "knex";
import { env } from "../env";

// @ts-ignore
import fetch from 'node-fetch';

export class SanctionController {
  constructor(private knex: Knex) {}

  updateSanction = async (req: Request, res: Response) => {
    try {
      // should check if a scan has been done recently!


      // perform API checking to namescan.io
      // Sample CLI:
      //   curl -X post https://api.namescan.io/v3/person-scans/emerald \
      //  -H "api-key: your-api-key" \
      //  -H "content-type: application/json" \
      //  -d "{'firstName':'john', 'lastName':'smith', 'dob':'1970', 'listType':'sanction' }"
      
      // In JS
      await this.fetchSanction(req.body.name);

      res.json({'result': 'ok'});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
      return;
    }
  };

  getAllSanction = async (req: Request, res: Response) => {
    try {
      let result = await this.knex.select(
        'sanction_history.id',
        'sanction_history.name',
        'sanction_history.result',
        'sanction_history.created_at',
      )
        .where('name', 'ilike', '%'+req.query.name+'%')
        .from('sanction_history')
        .orderBy('sanction_history.created_at', 'desc')
        .limit(1)

      let json: any = null;

      if (result[0] == null) {
        json = await this.fetchSanction(req.query.name + '')
      } else {
        json = JSON.parse(result[0]['result']);
      }
      
      res.json({numberOfMatches: json?.numberOfMatches, matches: json?.persons});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
      return;
    }
  };

  private async fetchSanction(name: string) {
    const response = await fetch('https://api.namescan.io/v3/person-scans/emerald', {
      method: 'POST',
      headers: {
        'api-key': env.namescaneApi,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ 'name': name.toLowerCase(), 'listType': 'sanction' })
    });

    const result = await response.json();

    // insert latest result to db
    await this.knex.insert({
      name: name,
      result: JSON.stringify(result),
      created_at: new Date(),
    }).into('sanction_history').returning('id');

    return result;
  }
}