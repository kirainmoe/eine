import { Request, Response } from "express";
import EineDB from "../../libs/db/EineDB";
declare function authenticate(req: Request, res: Response, db: EineDB): Promise<boolean>;
export default authenticate;
