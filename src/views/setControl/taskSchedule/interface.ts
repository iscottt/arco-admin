import { TableData } from '@arco-design/web-vue';

export interface ITaskSearch {
  taskStatus: string;
  chargeKind: string;
  targetLevel: string;
}

export interface ITaskEdit {
  targetLevel: any;
  scheduleClock: string;
  ruleKindId: string;
  ruleIds: string;
  taskId: string;
  patientType: string;
  branchId: string;
  areaId: string;
  deptId: string;
  targetId: string;
  scheduleType: string;
  scheduleDay: number;
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
