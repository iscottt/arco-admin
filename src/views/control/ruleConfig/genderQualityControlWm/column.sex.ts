import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '性别',
    slotName: 'sexId',
    width: 120,
  },
  {
    title: '不适用项目代码',
    dataIndex: 'drugCode',
    width: 160,
  },
  {
    title: '不适用项目名称',
    dataIndex: 'drugName',
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 160,
  },
];
