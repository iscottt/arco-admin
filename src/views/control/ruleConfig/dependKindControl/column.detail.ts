import { TableColumnData } from '@arco-design/web-vue';
export const detailColumns: TableColumnData[] = [
  {
    title: '组ID',
    dataIndex: 'groupId',
    width: 100,
  },

  {
    title: '创建时间',
    dataIndex: 'createDate',
    width: 120,
  },

  {
    title: '医保大类',
    dataIndex: 'ybChargeKind',
    width: 150,
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 160,
  },
];
