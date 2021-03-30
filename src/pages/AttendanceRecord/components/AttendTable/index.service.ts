import { blobToExcel } from '@/utils/util';
import { request } from 'ice';
import { stringify } from 'query-string';
import { Record } from './index.interface';

// 组长考勤列表
async function getAttendList({ current, pageSize }, form) {
  const params = { ...form };
  if (params.orgCode) {
    params.orgCode = params.orgCode.join(',');
  }
  const res = await request.post('/settle/groupleader/listData', { ...params, pageSize, pageNo: current });
  return {
    total: res.recordsTotal,
    list: res.data,
  };
}
// 调整上下班打卡时间
async function adjustClockTime(data) {
  return await request.post('/settle/adjustClockTime', data);
}
// 调整休息时长
async function adjustRestDuration(data) {
  return await request.post('/settle/adjustRestDuration', data);
}
// 调整上下班时间
async function adjustPlanClockTime(data) {
  return await request.post('/settle/adjustPlanClockTime', data);
}
// 调整旷工记录
async function adjustAbsent(data) {
  return await request.post('/settle/adjustAbsent', data);
}
// 提交审核
async function commitAudit(data) {
  return await request.post('/settle/commitAudit', data);
}
// 编辑
async function editMsg(data: Record) {
  return await request.post('/settle/groupLeader/edit', data);
}
// 日志
async function getLog(id) {
  return await request.get(`/settle/log?settleId=${id}`);
}

// 导出
async function doExport(data) {
  const str = stringify(data);
  const res = await request({
    responseType: 'blob',
    method: 'GET',
    data: null,
    url: `/settle/groupleader/exportByCondition?${str}`,
  });
  blobToExcel(res, '考勤记录');
}

// 导出异常数据
async function doAbnormalExport(data) {
  const res = await request({
    responseType: 'blob',
    method: 'GET',
    data: null,
    url: `/excel/download?excelType=20&uuid=${data}`,
  });
  blobToExcel(res, '导入异常数据');
}

export {
  getAttendList,
  adjustClockTime,
  adjustRestDuration,
  adjustPlanClockTime,
  adjustAbsent,
  commitAudit,
  getLog,
  editMsg,
  doExport,
  doAbnormalExport,
};