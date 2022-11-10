import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '收费项目',
    dataIndex: 'chargeName',
    width: 240,
    ellipsis: true,
    tooltip: {
      position: 'tr',
    },
  },
  {
    title: '中心编码',
    dataIndex: 'chargeCode',
    width: 150,
  },
  {
    title: '限制类型',
    slotName: 'limitType',
    width: 100,
  },

  {
    title: '状态',
    width: 100,
    slotName: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    width: 180,
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 240,
  },
];
