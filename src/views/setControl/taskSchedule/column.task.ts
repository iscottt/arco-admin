import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '规则大类',
    dataIndex: 'ruleKindName',
    width: 150,
  },
  {
    title: '就诊类型',
    slotName: 'patientType',
    width: 120,
  },
  {
    title: '定时类型',
    slotName: 'scheduleType',
    width: 120,
  },
  {
    title: '定时日期',
    slotName: 'scheduleDay',
    width: 120,
  },
  {
    title: '定时时间',
    dataIndex: 'scheduleClock',
    width: 120,
  },

  {
    title: '质控项目',
    ellipsis: true,
    tooltip: true,
    dataIndex: 'ruleNames',
    width: 150,
  },
  {
    title: '对象层级',
    slotName: 'targetLevel',
    width: 90,
  },
  {
    title: '质控对象',
    dataIndex: 'targetName',
    width: 200,
  },
  {
    title: '状态',
    slotName: 'taskStatus',
    width: 80,
  },
  {
    title: '定时表达式',
    dataIndex: 'scheduleTime',
    width: 150,
  },
  {
    title: '创建时间',
    slotName: 'createTime',
    width: 180,
  },

  {
    title: '操作',
    slotName: 'action',
    fixed: 'right',
    align: 'center',
    width: 155,
  },
];
