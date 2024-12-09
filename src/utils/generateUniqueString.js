import { customAlphabet } from "nanoid"
export const generateUniqueString =(length = 10) => {
    return nanoid(length);
}
export const generateUniqueCode = (length = 6) => {
    const numbersOnly = '0123456789';
    const nanoid = customAlphabet(numbersOnly, length);
    return nanoid();
}