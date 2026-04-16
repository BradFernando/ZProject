import { Client, Policy } from '../models/insurance.models';

export class LoadClients {
  static readonly type = '[Insurance] Load Clients';
  constructor(public filters?: any) {}
}

export class LoadPolicies {
  static readonly type = '[Insurance] Load Policies';
  constructor(public filters?: any) {}
}

export class LoadClientPolicies {
  static readonly type = '[Insurance] Load Client Policies';
  constructor(public clientId: number) {}
}

export class CreateClient {
  static readonly type = '[Insurance] Create Client';
  constructor(public client: Client) {}
}

export class UpdateClient {
  static readonly type = '[Insurance] Update Client';
  constructor(public id: number, public client: Client) {}
}

export class DeleteClient {
  static readonly type = '[Insurance] Delete Client';
  constructor(public id: number) {}
}

export class CreatePolicy {
  static readonly type = '[Insurance] Create Policy';
  constructor(public policy: Policy) {}
}

export class CancelPolicy {
  static readonly type = '[Insurance] Cancel Policy';
  constructor(public id: number) {}
}
