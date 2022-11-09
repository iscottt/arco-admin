import { TableColumnData } from '@arco-design/web-vue';

export const columns: TableColumnData[] = [
  {
    title: '处理状态',
    slotName: 'dealStatus',
    width: 120,
  },
  {
    title: '规则名称',
    dataIndex: 'ruleName',
    width: 150,
  },
  {
    title: '规则大类',
    dataIndex: 'ruleKindName',
    width: 120,
  },
  {
    title: '病案号',
    dataIndex: 'bah',
    width: 120,
  },
  {
    title: '住院号',
    dataIndex: 'patientNo',
    width: 120,
  },
  {
    title: '患者姓名',
    dataIndex: 'patientName',
    width: 120,
  },
  {
    title: '质控动作',
    slotName: 'actionType',
    width: 120,
  },
  {
    title: '质控结果说明',
    dataIndex: 'qcRemark',
    ellipsis: true,
    tooltip: {
      position: 'tr',
    },
    width: 200,
  },
  {
    title: '创建时间',
    dataIndex: 'createTimeString',
    width: 180,
  },
];
