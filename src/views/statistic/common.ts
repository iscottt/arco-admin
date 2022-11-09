import { SelectOption } from '@arco-design/web-vue';

export const dateTypeList: any = [
  { value: 'Y', label: '年份' },
  { value: 'M', label: '月份' },
  { value: 'D', label: '日期' },
];

export const ruleLevelList: SelectOption[] = [
  { value: '1', label: '规则大类' },
  { value: '2', label: '规则' },
];

export const statisticLevelList: SelectOption[] = [
  { value: '1', label: '全院' },
  { value: '2', label: '科室' },
];
