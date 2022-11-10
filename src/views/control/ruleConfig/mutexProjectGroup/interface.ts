export interface IGroupSearch {
  status: string;
  srcChargeCode: string;
  limitType: string;
}

export interface IGroupEdit {
  status: string;
  srcChargeCode: any;
  limitType: string;
  groupId: string;
}

export interface IGroupDetailEdit {
  mutexChargeCode: string;
  groupId: string;
  seqId: string;
}
