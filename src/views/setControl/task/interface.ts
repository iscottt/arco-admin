import { TableData } from '@arco-design/web-vue';

export interface ITaskSearch {
  taskStatus: string;
  chargeKind: string;
  targetLevel: string;
  startTime: string;
  endTime: string;
  taskType: string;
  resultType: string;
  targetId: string;
  branchId: string;
  areaId: string;
  deptId: string;
}

export interface ITaskEdit {
  targetLevel: any;
  patientStatus: string;
  ruleKindId: string;
  ruleIds: string;
  taskId: string;
  patientType: string;
  branchId: string;
  areaId: string;
  deptId: string;
  targetId: string;
  startTime: string;
  endTime: string;
  operatorCode: string;
}
export interface ITaskInfo {
  targetLevel: any;
  ruleKindName: string;
  patientType: string;
  ruleNames: string;
  targetName: string;
  taskStatus: string;
  targetCount: string;
  outlierPatientCount: string;
  outlierCount: string;
  remark: string;
  qcTaskResults: TableData[];
}
