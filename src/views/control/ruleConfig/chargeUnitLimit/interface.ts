export interface IUnitLimitSearch {
  status: string;
  chargeUnit: string;
  actionType: string;
}

export interface IUnitLimitEdit {
  status: string;
  expChargeIds: any;
  actionType: string;
  limitType: string;
  limitCount: number;
  seqId: string;
  chargeKind: string;
  expChargeNames: string;
  chargeUnit: string;
}
