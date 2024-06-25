import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const wordsAtom = atom({
  key: "wordsAtom",
  default: "",
  effects_UNSTABLE: [persistAtom],
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

interface LetterProps {
  letter: string;
  color: string;
}

export const letterArrayAtom = atom<LetterProps[]>({
  key: "letterArrayAtom",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
