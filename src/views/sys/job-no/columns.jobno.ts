import { TableColumnData } from '@arco-design/web-vue';

export const columns: TableColumnData[] = [
  {
    title: '用户名称',
    dataIndex: 'operatorName',
    width: 120,
  },

  {
    title: '登录账号',
    dataIndex: 'operatorCode',
    width: 120,
  },
  {
    title: '电话号码',
    dataIndex: 'phoneNumber',
    width: 180,
  },
  {
    title: '用户层级',
    slotName: 'operatorLevel',
    width: 120,
  },
  {
    title: '所属院区',
    dataIndex: 'branchName',
    width: 200,
  },
  {
    title: '所属病区',
    dataIndex: 'areaName',
    width: 150,
  },
  {
    title: '所属科室',
    dataIndex: 'deptName',
    width: 120,
  },
  {
    title: '状态',
    slotName: 'blockStatus',
    width: 120,
  },
  {
    title: '角色类型',
    slotName: 'roleList',
    width: 120,
  },
  {
    title: '操作',
    slotName: 'actions',
    align: 'center',
    width: 240,
  },
];
