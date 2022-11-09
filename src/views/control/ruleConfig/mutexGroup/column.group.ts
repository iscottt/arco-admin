import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '组名称',
    dataIndex: 'groupName',
    width: 120,
  },
  {
    title: '限制类型',
    slotName: 'limitType',
    width: 100,
  },
  {
    title: '状态',
    width: 80,
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
