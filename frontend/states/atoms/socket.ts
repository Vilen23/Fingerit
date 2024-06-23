import { atom } from "recoil";

export const socketAtom = atom<WebSocket | null>({
  key: "socket",
  default: null,
});
