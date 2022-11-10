export interface IGroupSearch {
  status: string;
  chargeCode: string;
  limitType: string;
}

export interface IGroupEdit {
  status: string;
  chargeCode: any;
  limitType: string;
  groupId: string;
}

export interface IGroupDetailEdit {
  ybChargeKind: string;
  groupId: string;
  seqId: string;
}
