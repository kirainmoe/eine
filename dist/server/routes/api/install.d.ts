/// <reference types="express" />
import { EineRouteHandlerType } from "../types";
declare function install({ req, res, logger, db, server }: EineRouteHandlerType): Promise<void | import("express").Response<any, Record<string, any>>>;
declare const _default: {
    handler: typeof install;
    validator: import("express-validator").ValidationChain[];
};
export default _default;
