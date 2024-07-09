export const alphabets = '^[A-Za-z]+';
export const numbers = '^[0-9+]+';
export const phoneNumber = '^[0-9+-]+';
export const alphabetSpace = '^[A-Za-z ]+';
export const alphabetSpaceComma = '^[A-Za-z, ]+';
export const alphaNumeric = '^[A-Za-z0-9]+';
export const alphaNumericSpace = '^[A-Za-z0-9 ]+';
export const alphaNumSpaceSpecial = '^[A-Za-z0-9-/,#:.() ]+';
export const relationAllowedChars = '^[A-Za-z- ]+';
export const alphabetsSpaceDot = '^[a-zA-Z. ]+';
export const alphabetSpaceCommaBack = '^[a-zA-Z, ]+';
export const phnNumbers = '^[0-9+-]+';
export const passportAndVisaRegExp = '^[A-Za-z0-9-/()]+';
export const dobFirstDate = 130;
export const passportVisaFirstDate = 100;
export const passportVisaLastDate = 100;
export const passwordRegExp =
  '/^(?=.*[A-Za-z])(?=.*d)(?=.*[$@$!%*#?&])[A-Za-zd$@$!%*#?&]{8,}$/';
export const phn_no = '^[0-9]{10}$';
export const pincode = '^[0-9]{6}$';
export const userNameToRegr = '^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,20}$';
export const emailValidation = '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
