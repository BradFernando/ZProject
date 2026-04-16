export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: any) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class SetToken {
  static readonly type = '[Auth] SetToken';
  constructor(public token: string) {}
}
