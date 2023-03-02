export interface User {
    id: number;
    username: string;
    password: string;
  }

  interface ReqUser {
    id: number;
    username: string;
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