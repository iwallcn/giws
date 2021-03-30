import BasicLayout from '@/layouts/BasicLayout';
import FusionAttendanceRecordTable from '@/pages/AttendanceRecord';

const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/attendanceRecord/list',
        component: FusionAttendanceRecordTable,
      },
      {
        path: '/',
        redirect: '/dashboard/analysis',
      },
    ],
  },
];
export default routerConfig;
