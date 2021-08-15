import { SendTarget } from "./types";

export const FriendTarget = (qq: number): SendTarget => ({
  id: qq,
});

export const GroupTarget = (group: number): SendTarget => ({
  group: { id: group },
});

export const TempTarget = (qq: number, group: number): SendTarget => ({
  id: qq,
  group: { id: group },
});

export const Myself = () => ({
  myself: true,
});
