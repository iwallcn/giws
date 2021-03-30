const headerMenuConfig = [];

const asideMenuConfig = [
  {
    name: 'demo页面',
    path: '/',
    icon: 'chart-pie',
    children: [
      {
        name: '分析页面',
        path: '/dashboard/analysis',
      },
      {
        name: '监控页面',
        path: '/dashboard/monitor',
      },
      {
        name: '工作台',
        path: '/dashboard/workplace',
      },
      {
        name: '高级详情',
        path: '/detail/advanced',
      },
      {
        name: '列表',
        path: '/attendanceRecord/list',
      },
    ],
  },
];

export { headerMenuConfig, asideMenuConfig };
