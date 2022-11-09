import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '任务类型',
    slotName: 'isSchedule',
    width: 150,
  },
  // patientType
  {
    title: '就诊类型',
    slotName: 'patientType',
    width: 120,
  },
  {
    title: '病人类型',
    slotName: 'patientStatus',
    width: 120,
  },
  {
    title: '质控大类',
    dataIndex: 'ruleKindName',
    width: 120,
  },
  {
    title: '质控项目',
    dataIndex: 'ruleNames',
    ellipsis: true,
    tooltip: {
      position: 'tr',
    },
    width: 200,
  },
  {
    title: '对象层级',
    slotName: 'targetLevel',
    width: 100,
  },
  {
    title: '质控对象',
    dataIndex: 'targetName',
    width: 220,
  },
  {
    title: '任务状态',
    slotName: 'taskStatus',
    width: 100,
  },
  {
    title: '质控患者数量',
    dataIndex: 'targetCount',
    width: 120,
  },
  {
    title: '异常患者数量',
    dataIndex: 'outlierPatientCount',
    width: 120,
  },
  {
    title: '异常收费数量',
    dataIndex: 'outlierCount',
    width: 120,
  },
  {
    title: '创建时间',
    slotName: 'createTime',
    width: 180,
  },
  {
    title: '处理开始时间',
    slotName: 'exeTime',
    width: 180,
  },
  {
    title: '处理结束时间',
    slotName: 'finishTime',
    width: 180,
  },
  {
    title: '处理说明',
    dataIndex: 'remark',
    ellipsis: true,
    tooltip: {
      position: 'tr',
    },
    width: 150,
  },
  {
    title: '操作',
    slotName: 'action',
    fixed: 'right',
    align: 'center',
    width: 120,
  },
];
