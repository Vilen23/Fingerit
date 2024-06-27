import { atom } from "recoil";

export const challengeUsers = atom({
  key: "challengeUsers",
  default: [],
});

export const challengeStartAtom = atom({
  key: "challengeStart",
  default: false,
});

interface userSpeedProps {
  speed: number;
  user: {
    id: string;
    username: string;
  };
}

export const userSpeedChallenge = atom<userSpeedProps[]>({
  key: "userSpeedChallenge",
  default: [],
});

export const fetchAtom = atom({
  key: "fetch",
  default: false,
});
