import { EineRouteHandlerType } from "../types";
declare function sendText({ req, res, eine, server, db }: EineRouteHandlerType): Promise<void>;
declare const _default: {
    handler: typeof sendText;
    validator: import("express-validator").ValidationChain[];
};
export default _default;
