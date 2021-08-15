import { EineRouteHandlerType } from "../types";
declare function info({ res, server, eine }: EineRouteHandlerType): Promise<void>;
declare const _default: {
    handler: typeof info;
    validator: never[];
};
export default _default;
