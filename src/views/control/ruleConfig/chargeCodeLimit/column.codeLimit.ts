import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '收费项目编码',
    dataIndex: 'chargeCode',
    width: 150,
  },
  {
    title: '收费项目',
    dataIndex: 'chargeName',
    ellipsis: true,
    tooltip: {
      position: 'tr',
    },
    width: 240,
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
    title: '状态',
    slotName: 'status',
    align: 'center',
    width: 80,
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 160,
  },
];
