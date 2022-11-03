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
/**
 * 过滤数据
 * @param resourceData
 * @returns
 */
export function useSearchUser(resourceData) {
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
