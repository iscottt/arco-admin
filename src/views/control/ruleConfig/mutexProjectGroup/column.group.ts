import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '加收项目编码',
    dataIndex: 'srcChargeName',
    width: 200,
  },
  {
    title: '限制类型',
    slotName: 'limitType',
    width: 90,
  },
  {
    title: '状态',
    width: 90,
    slotName: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'statusDate',
    width: 180,
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 240,
  },
];
