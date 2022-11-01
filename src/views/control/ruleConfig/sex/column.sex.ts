import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '性别',
    slotName: 'sexId',
    width: 120,
  },
  {
    title: '不适用项目代码',
    dataIndex: 'chargeCode',
    width: 150,
  },
  {
    title: '不适用项目名称',
    dataIndex: 'chargeName',
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 120,
  },
];
