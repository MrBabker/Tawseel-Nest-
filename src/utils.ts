export const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)';

export enum UserType {
  normal = 'normal',
  admin = 'admin',
}

export enum MealTypes {
  Sandwitchs = 'sandwitchs',
  Meals = 'meals',
  Drinks = 'drinks',
  Additions = 'Additions',
}

export enum CartTypes {
  buy = 'buy',
  return = 'return',
}

export class JWT_Payload {
  id: number;
  username: string;
  email: string;
  phonenumber: string;
  location: string;
  isemployee: boolean;
  employeetype: string;
}

export const CURRENT_USER_KEY = 'user';

export const DOMAIN = 'http://localhost:5000';
