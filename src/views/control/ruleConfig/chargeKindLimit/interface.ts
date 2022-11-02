export interface IKindLimitSearch {
  status: string;
  chargeKind: string;
  actionType: string;
}

export interface IKindLimitEdit {
  status: string;
  expChargeIds: any;
  actionType: string;
  limitType: string;
  limitCount: number;
  seqId: string;
  chargeKind: string;
  expChargeNames: string;
}
