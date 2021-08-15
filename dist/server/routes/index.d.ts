/// <reference types="express" />
export declare const api: {
    accountInfo: {
        handler: ({ req, res, eine, db, server }: import("./types").EineRouteHandlerType) => Promise<void>;
        validator: import("express-validator").ValidationChain[];
    };
    install: {
        handler: ({ req, res, logger, db, server }: import("./types").EineRouteHandlerType) => Promise<void | import("express").Response<any, Record<string, any>>>;
        validator: import("express-validator").ValidationChain[];
    };
    groupInfo: {
        handler: ({ req, res, eine, server, db }: import("./types").EineRouteHandlerType) => Promise<void>;
        validator: import("express-validator").ValidationChain[];
    };
    login: {
        handler: ({ req, res, logger, db, server }: import("./types").EineRouteHandlerType) => Promise<import("express").Response<any, Record<string, any>> | undefined>;
        validator: import("express-validator").ValidationChain[];
    };
    publicInfo: {
        handler: ({ res, server, eine }: import("./types").EineRouteHandlerType) => Promise<void>;
        validator: never[];
    };
    sendText: {
        handler: ({ req, res, eine, server, db }: import("./types").EineRouteHandlerType) => Promise<void>;
        validator: import("express-validator").ValidationChain[];
    };
    magic: {
        handler: ({ res, server }: import("./types").EineRouteHandlerType) => void;
        validator: never[];
    };
};
export declare const panel: {
    install: {
        handler: ({ res, server, db }: import("./types").EineRouteHandlerType) => Promise<void>;
        validator: never[];
    };
};
export * as ws from "./ws";
