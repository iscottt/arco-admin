export interface IExclusiveSearch {
  status: string;
  chargeCode: string;
  ybChargeKind: string;
  limitType: string;
}

export interface IExclusiveEdit {
  status: string;
  chargeCode: string;
  expChargeIds: any;
  limitType: string;
  ybChargeKind: string;
  seqId: string;
}
