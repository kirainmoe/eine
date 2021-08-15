import { EineRouteHandlerType } from "../types";
declare function echo({ res, server, eine }: EineRouteHandlerType): Promise<void>;
declare const _default: {
    handler: typeof echo;
    validator: never[];
};
export default _default;
