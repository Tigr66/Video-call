import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateRoomCode = customAlphabet(alphabet, 6);
