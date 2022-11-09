export interface IGroupSearch {
  status: string;
  groupName: string;
  limitType: string;
}

export interface IGroupEdit {
  status: string;
  groupName: any;
  limitType: string;
  groupId: string;
}

export interface IGroupDetailEdit {
  mutexChargeCode: string;
  groupId: string;
  seqId: string;
}
