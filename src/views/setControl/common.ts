export const targetLevelOpts: any = [
  { value: 1, label: '全院' },
  { value: 2, label: '院区' },
  { value: 3, label: '病区' },
  { value: 4, label: '科室' },
  { value: 5, label: '医生' },
  { value: 6, label: '病人' },
];

export const taskStatusOpts = [
  { value: 'U', label: '未处理' },
  { value: 'P', label: '处理中' },
  { value: 'F', label: '已处理' },
  { value: 'E', label: '处理异常' },
];

export const patientTypeList = [
  { value: '1', label: '住院' },
  { value: '2', label: '门诊' },
];

export const patientStatusList = [
  { value: '1', label: '在院' },
  { value: '2', label: '离院' },
];
export const taskScheduleStatusList = [
  { value: '1', label: '生效' },
  { value: '2', label: '失效' },
];
export const scheduleTypeList = [
  { value: '1', label: '每月' },
  { value: '2', label: '每天' },
];
// 质控结果
export const resultTypeList = [
  { value: '1', label: '有异常' },
  { value: '2', label: '无异常' },
];
// 任务类型
export const taskTypeList = [
  { value: '1', label: '定时任务' },
  { value: '2', label: '手工任务' },
];
// 任务类型
export const dealList = [
  { value: 'N', label: '未处理' },
  { value: 'Y', label: '已处理' },
];
/**
 * 过滤数据
 * @param resourceData
 * @returns
 */
export function useSearchUser(resourceData) {
  if (!resourceData) return [];
  const result: any[] = [];
  resourceData.map((item) => {
    const obj = {
      value: item.targetId,
      label: item.targetId + '-' + item.targetName,
    };
    result.push(obj);
  });
  return result;
}
