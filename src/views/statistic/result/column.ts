import { TableColumnData } from '@arco-design/web-vue';

export const columns: TableColumnData[] = [
  {
    title: '统计时段',
    align: 'center',
    dataIndex: 'statDate',
    width: 150,
  },
  {
    title: '质控规则',
    align: 'center',
    dataIndex: 'ruleKindName',
    width: 150,
  },
  {
    title: '统计范围',
    align: 'center',
    dataIndex: 'deptName',
    width: 120,
  },
  {
    title: '质控异常数',
    align: 'center',
    dataIndex: 'totalTaskCnt',
    width: 120,
  },
  {
    title: '已处理异常数',
    align: 'center',
    dataIndex: 'dealCount',
    width: 120,
  },
  {
    title: '未处理异常数',
    align: 'center',
    dataIndex: 'unDealCount',
    width: 120,
  },
  {
    title: '操作',
    slotName: 'actions',
    align: 'center',
    fixed: 'right',
    width: 90,
  },
];
