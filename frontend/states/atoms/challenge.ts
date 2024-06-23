import { atom } from "recoil";

export const challengeUsers = atom({
  key: "challengeUsers",
  default: [],
});

export const challengeStartAtom = atom({
  key: "challengeStart",
  default: false,
});
