import { EineRouteHandlerType } from "../types";
declare function friendInfo({ req, res, eine, server, db }: EineRouteHandlerType): Promise<void>;
declare const _default: {
    handler: typeof friendInfo;
    validator: import("express-validator").ValidationChain[];
};
export default _default;
