import { atom } from "recoil";

interface resultProps {
  accuracy: string;
  speed: string;
  rawspeed: string;
}

export const resultAtom = atom({
  key: "resultAtom",
  default: {
    accuracy:"",
    speed:"",
    rawspeed:"",
  },
});
