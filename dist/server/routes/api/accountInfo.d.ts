import { EineRouteHandlerType } from "../types";
declare function accountInfo({ req, res, eine, db, server }: EineRouteHandlerType): Promise<void>;
declare const _default: {
    handler: typeof accountInfo;
    validator: import("express-validator").ValidationChain[];
};
export default _default;
