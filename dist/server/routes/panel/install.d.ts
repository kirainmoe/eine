import { EineRouteHandlerType } from "../types";
declare function install({ res, server, db }: EineRouteHandlerType): Promise<void>;
declare const _default: {
    handler: typeof install;
    validator: never[];
};
export default _default;
