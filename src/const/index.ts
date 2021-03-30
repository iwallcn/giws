
const BUSINESS_TYPE = [
  {
    label: '集运',
    value: 'CT',
  },
  {
    label: '转运',
    value: 'TRS',
  },
  {
    label: '直送',
    value: 'DS',
  },
]
const PROCESS_STATUS = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '生效',
    value: '1',
  },
  {
    label: '失效',
    value: '2',
  },
]
// 考勤审核状态
const CHECK_STATUS = [
   {
    label: '全部',
    value: '1',
  },
  {
    label: '未提交',
    value: '2',
  },
  {
    label: '待审核',
    value: '3',
  },
  {
    label: '已驳回',
    value: '4',
  },
  {
    label: '审核通过',
    value: '5',
  },
  {
    label: '二次提交',
    value: '6',
  },
  {
    label: '超时',
    value: '7',
  },
]
// 出勤状态
const ATTEND_STATUS = [
   {
    label: '全部',
    value: '',
  },
  {
    label: '正常',
    value: '1',
  },
  {
    label: '迟到',
    value: '2',
  },
  {
    label: '早退',
    value: '3',
  },
  {
    label: '异常',
    value: '5',
  }
]
// 旷工状态
const ABSENT_STATUS = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '无',
    value: '0',
  },
  {
    label: '旷工0.5d',
    value: '1',
  },
  {
    label: '旷工1d',
    value: '2',
  },
]

// 班次
const SHIFT_STATUS = [
  {
    label: '白班',
    value: 1,
  },
  {
    label: '晚班',
    value: 2,
  }
]

// HR工作台  状态
const HR_STATUS = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '普通',
    value: 0
  },
  {
    label: '日结',
    value: 1
  }
]

// HR工作台  审核状态
const HR_CHECK_STATUS = [
  {
    label: '全部',
    value: 1
  },
  {
    label: '待审核',
    value: 3
  },
  {
    label: '已驳回',
    value: 4
  },
  {
    label: '审核通过',
    value: 5
  },
  {
    label: '超时',
    value: 7
  }
]

// HR工作台  工时属性
const HR_WOR_TIMES = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '白班',
    value: 1
  },
  {
    label: '晚班',
    value: 2
  }
]

// HR工作台 旷工
const HR_AbSENTEEISM = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '无',
    value: 0
  },
  {
    label: '旷工0.5天',
    value: 1
  },
  {
    label: '旷工1天',
    value: 2
  }
]

const isProd = process.env.NODE_ENV === 'production'
const hostname = location.hostname
let VERIABLE = ''
if(hostname.includes('test')) {
  VERIABLE = 'test'
} else if (hostname.includes('localhost')) {
    VERIABLE = 'dev'
} else if (hostname.includes('uat')) {
  VERIABLE = 'uat'
}



export {
  BUSINESS_TYPE,
  PROCESS_STATUS,
  CHECK_STATUS,
  ATTEND_STATUS,
  ABSENT_STATUS,
  SHIFT_STATUS,
  HR_STATUS,
  HR_CHECK_STATUS,
  HR_WOR_TIMES,
  HR_AbSENTEEISM,
  VERIABLE
}