import { EineRouteHandlerType } from "../types";
declare function publicInfo({ res, server, eine }: EineRouteHandlerType): Promise<void>;
declare const _default: {
    handler: typeof publicInfo;
    validator: never[];
};
export default _default;
