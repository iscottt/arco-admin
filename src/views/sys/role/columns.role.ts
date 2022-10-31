import { TableColumnData } from '@arco-design/web-vue';

export const columns: TableColumnData[] = [
  {
    title: '角色名称',
    align: 'center',
    dataIndex: 'roleName',
  },
  {
    title: '状态',
    align: 'center',
    slotName: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    align: 'center',
    slotName: 'actions',
  },
];
