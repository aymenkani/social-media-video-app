export interface JwtPayload {
  sub: string | number;
  email: string;
}

export interface UserAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
