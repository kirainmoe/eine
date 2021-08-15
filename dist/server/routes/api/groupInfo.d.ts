import { EineRouteHandlerType } from "../types";
declare function groupInfo({ req, res, eine, server, db }: EineRouteHandlerType): Promise<void>;
declare const _default: {
    handler: typeof groupInfo;
    validator: import("express-validator").ValidationChain[];
};
export default _default;
