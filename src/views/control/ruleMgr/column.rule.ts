import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '规则大类',
    dataIndex: 'ruleKindName',
    width: 150,
  },
  {
    title: '规则名称',
    dataIndex: 'ruleName',
    width: 200,
  },
  {
    title: '规则说明',
    dataIndex: 'ruleContent',
    ellipsis: true,
    tooltip: true,
    width: 200,
  },
  {
    title: '质控动作',
    slotName: 'actionType',
    width: 120,
  },
  {
    title: '状态',
    slotName: 'status',
    width: 150,
  },
  {
    title: '变更时间',
    slotName: 'statusDate',
    width: 200,
  },
];
