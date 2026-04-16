export interface Client {
  id?: number;
  identificationNumber: string; // 10 dígitos
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  active?: boolean;
}

export type PolicyType = 'VIDA' | 'AUTOMOVIL' | 'SALUD' | 'HOGAR';
export type PolicyStatus = 'ACTIVA' | 'CANCELADA';

export interface Policy {
  id?: number;
  clientId: number;
  type: PolicyType;
  startDate: string;      // ISO Date
  expirationDate: string; // ISO Date
  insuredAmount: number;
  status?: PolicyStatus;
}

export interface AuthResponse {
  token: string;
}

export interface DecodedToken {
  sub: string;
  role?: string;
  authorities?: any[];
  roles?: string[];
  clientId?: number;
  exp: number;
  iat?: number;
}
