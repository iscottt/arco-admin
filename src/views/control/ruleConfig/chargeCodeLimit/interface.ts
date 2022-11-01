export interface ICodeLimitSearch {
  status: string;
  chargeCode: string;
  actionType: string;
  keyWord: string;
  limitType: string;
  limitCount: string;
}

export interface ICodeLimitEdit {
  status: string;
  chargeCode: string;
  actionType: string;
  limitType: string;
  limitCount: number;
  seqId: string;
}
