import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '费用归类',
    slotName: 'chargeKindName',
    width: 90,
  },
  {
    title: '费用单位',
    slotName: 'chargeUnitName',
    width: 90,
  },
  {
    title: '限制类型',
    slotName: 'limitTypeName',
    width: 90,
  },
  {
    title: '限制数量',
    dataIndex: 'limitCount',
    width: 90,
  },
  {
    title: '质控动作',
    slotName: 'actionTypeName',
    width: 90,
  },
  {
    title: '例外的收费项目',
    slotName: 'expChargeNames',
    ellipsis: true,
    tooltip: true,
    width: 200,
  },
  {
    title: '状态',
    slotName: 'status',
    width: 90,
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 160,
  },
];
