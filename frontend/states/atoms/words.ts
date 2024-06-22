import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const wordsAtom = atom({
  key: "wordsAtom",
  default: "",
});

export const wordDataAtom = atom({
  key: "wordData",
  default: {
    common_words: [],
  },
  effects_UNSTABLE: [persistAtom],
});

export const isDataAtom = atom({
  key: "isDataAtom",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const challengeAtom = atom({
  key: "challengeAtom",
  default: "",
});
