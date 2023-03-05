export interface User {
    id: number;
    username: string;
    password: string;
    permissionsLevel: number;
  }

  interface ReqUser {
    id: number;
    username: string;
    permissionsLevel: number;
  }

  declare global {
    namespace Express {
      interface Request {
        user?: ReqUser;
      }
    }
  }


declare global {
    namespace Express {
      interface Request {
        userId?: string;
      }
    }
  }

export const claimFinanceItems = [
  {name: 'Periodical payments', 'subgroup': 'indeminty', id: 1},
  {name: 'Permanent Incapacity', 'subgroup': 'indeminty', id: 2},
  {name: 'Medical expenses', 'subgroup': 'indeminty', id: 3},
  {name: 'Death', 'subgroup': 'indeminty', id: 4},
  {name: 'Claimant legal costs', 'subgroup': 'indeminty', id: 5},
  {name: 'Common Law', 'subgroup': 'indeminty', id: 6},
  {name: 'Loss adjuster fee', 'subgroup': 'expense', id: 7},
  {name: 'IME fee', 'subgroup': 'expense', id: 8},
  {name: 'Surveillance fee', 'subgroup': 'expense', id: 9},
  {name: 'TPA fee', 'subgroup': 'expense', id: 10},
  {name: 'Panel doctor fee', 'subgroup': 'expense', id: 11},
  {name: 'Panel rehab fee', 'subgroup': 'expense', id: 12},
  {name: 'Defense cost', 'subgroup': 'expense', id: 13},
]