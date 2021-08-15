/// <reference types="express" />
import { EineRouteHandlerType } from "../types";
declare function login({ req, res, logger, db, server }: EineRouteHandlerType): Promise<import("express").Response<any, Record<string, any>> | undefined>;
declare const _default: {
    handler: typeof login;
    validator: import("express-validator").ValidationChain[];
};
export default _default;
