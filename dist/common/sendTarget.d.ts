import { SendTarget } from "./types";
export declare const FriendTarget: (qq: number) => SendTarget;
export declare const GroupTarget: (group: number) => SendTarget;
export declare const TempTarget: (qq: number, group: number) => SendTarget;
export declare const Myself: () => {
    myself: boolean;
};
