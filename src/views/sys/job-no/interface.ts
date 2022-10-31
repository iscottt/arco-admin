export interface JobSearchProps {
  operatorName: string;
  phoneNumber: string;
  operatorCode: string;
  roleList: string;
  operatorLevel: string;
  blockStatus: string;
}
export interface JobModalProps {
  operatorCode: string;
  operatorName: string;
  password: string;
  phoneNumber: string;
  blockStatus: 'N' | 'Y';
  roleList: any[];
  branchId: string;
  deptId: string;
  areaId: string;
}
