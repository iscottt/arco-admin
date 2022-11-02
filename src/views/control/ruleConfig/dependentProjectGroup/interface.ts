export interface IGroupSearch {
  status: string;
  chargeCode: string;
  limitType: string;
}

export interface IGroupEdit {
  status: string;
  srcChargeCode: any;
  limitType: string;
  groupId: string;
}

export interface IGroupDetailEdit {
  dependChargeCode: string;
  groupId: string;
  seqId: string;
}
