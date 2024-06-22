import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const preferenceAtom = atom({
  key: "preferenceAtom",
  default: {
    mode: "words",
    value: 10,
  },
  effects_UNSTABLE: [persistAtom],
});

export const charCustomAtom = atom({
  key: "charCustomAtom",
  default: "",
});

export const customReadyAtom = atom({
  key: "customReadyAtom",
  default: false,
});
