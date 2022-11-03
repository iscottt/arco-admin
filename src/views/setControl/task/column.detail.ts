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
    width: 150,
  },
  {
    title: '科室名称',
    dataIndex: 'departName',
    width: 120,
  },
  {
    title: '病案号/患者ID',
    dataIndex: 'bah',
    width: 150,
  },
  {
    title: '住院号/门诊号',
    dataIndex: 'patientNo',
    width: 150,
  },
  {
    title: '患者姓名',
    dataIndex: 'patientName',
    width: 100,
  },
  {
    title: '质控动作',
    slotName: 'actionType',
    width: 100,
  },
  {
    title: '质控结果说明',
    dataIndex: 'qcRemark',
    ellipsis: true,
    tooltip: true,
    width: 200,
  },
  {
    title: '操作',
    slotName: 'action',
    fixed: 'right',
    align: 'center',
    width: 90,
  },
];
