import React, { useCallback, useEffect } from 'react';
import {
  Button,
  Select,
  Form,
  Field,
  Table,
  Card,
  Pagination,
  Message,
  Input,
  Divider,
  DatePicker,
  ResponsiveGrid,
  Grid,
} from '@fpxfd/next';
import { useFusionTable, useRequest, useSetState } from 'ahooks';
import {
  getAttendList,
  adjustClockTime,
  adjustRestDuration,
  adjustPlanClockTime,
  adjustAbsent,
  commitAudit,
  doExport,
  getLog,
  editMsg,
} from './index.service';

import styles from './index.module.scss';
import { ABSENT_STATUS, ATTEND_STATUS, CHECK_STATUS, HR_STATUS } from '@/const';
import OperationDialog from './OperationDialog';
import { DialogState, Record, OperaitionProps } from './index.interface';
import moment from 'moment';
import Auth from '@/components/Auth';
import FpxPagination from '@/components/FpxPagination';

const { Row } = Grid;
const { Cell } = ResponsiveGrid;

const FormItem = Form.Item;

const nowDate = moment().format('YYYY-MM-DD');
const beforeNowDate = moment().add('days', -14).format('YYYY-MM-DD');

const AttendTable: React.FunctionComponent = (): JSX.Element => {
  const [state, setState] = useSetState<DialogState>({
    actionType: 'edit',
    actionVisible: false,
    dataSource: null,
    okLoading: false,
    auditLoading: false,
    orgCode: [],
    rowSelection: {
      onChange: (ids, records) => onRowChange(ids, records),
      selectedRowKeys: [],
    },
  });

  const field = Field.useField([]);

  // table选择变化
  const onRowChange = useCallback(
    (ids, records) => {
      const { rowSelection } = state;
      rowSelection.selectedRowKeys = ids;
      setState({ rowSelection });
    },
    [setState, state],
  );

  // 清空table选中数据
  const clearSelectedTable = useCallback(() => {
    const { rowSelection } = state;
    rowSelection.selectedRowKeys = [];
    setState({
      rowSelection,
    });
  }, [setState, state]);

  // 查询前先清空table选中数据
  const doSearch = (pagination, form) => {
    clearSelectedTable();
    return getAttendList(pagination, form);
  };

  const { paginationProps, tableProps, search, error, refresh, loading } = useFusionTable(doSearch, {
    field,
    defaultPageSize: 20,
    debounceInterval: 500,
  });
  const { submit, reset } = search;

  // 重置
  const doReset = useCallback(() => {
    clearSelectedTable();
    reset();
  }, [reset, setState, state, clearSelectedTable]);

  // 开启弹窗
  const operationCallback = useCallback(
    async ({ actionType, dataSource }: OperaitionProps) => {
      const { rowSelection } = state;
      const { selectedRowKeys } = rowSelection;
      const shouldSelect = ['clockIn', 'rest', 'commute', 'absenteeism'].includes(actionType);
      if (selectedRowKeys.length === 0 && shouldSelect) {
        Message.error('请至少选择一条数据');
        return;
      }
      let logData;
      if (actionType === 'log') {
        logData = await getLog(dataSource!.id);
      }
      const newValues = {
        actionType,
        dataSource: logData || { ...dataSource },
        actionVisible: true,
      };
      setState(newValues);
    },
    [setState, state],
  );

  // 关闭弹框
  const handleCancel = useCallback((): void => {
    setState({ actionVisible: false, okLoading: false });
  }, [setState]);

  // 根据actionType返回接口
  const funcMap = (type: string): Function => {
    const funcs = {
      clockIn: (params) => adjustClockTime(params),
      rest: (params) => adjustRestDuration(params),
      commute: (params) => adjustPlanClockTime(params),
      absenteeism: (params) => adjustAbsent(params),
      edit: (params) => editMsg(params),
    };
    return funcs[type];
  };

  // 获取编辑提交参数
  const getEditParams = ({
    id,
    absent,
    checkStatus,
    orgCode,
    orgName,
    name,
    remark,
    shiftId,
    date,
    submitEndTime,
    auditEndTime,
    checkInTime,
    checkOutTime,
    code,
    clockInTime,
    clockOutTime,
    settleTime,
    restDuration,
    settleRule,
    shiftType,
  }: Record) => {
    return {
      id,
      absent,
      checkStatus,
      orgCode,
      orgName,
      name,
      remark,
      shiftId,
      date,
      submitEndTime,
      auditEndTime,
      checkInTime,
      checkOutTime,
      code,
      clockInTime,
      clockOutTime,
      settleTime,
      restDuration,
      settleRule,
      shiftType,
    };
  };

  // 弹窗内容提交
  const handleOk = useCallback(
    async (data: Record) => {
      const saveFunc = funcMap(state.actionType);
      const isEdit = state.actionType === 'edit';
      const parmas = isEdit
        ? getEditParams(data)
        : { ...data, settleIds: state.rowSelection.selectedRowKeys.join(','), operationType: 1 };
      setState({
        okLoading: true,
      });
      saveFunc(parmas)
        .then(() => {
          Message.success('操作成功');
          refresh();
          state.rowSelection.selectedRowKeys = []; // 清空复选框
          handleCancel();
        })
        .finally(() => {
          setState({
            okLoading: false,
          });
        });
    },
    [state, setState, refresh, handleCancel],
  );

  // 提交审核
  const doCommitAudit = useCallback(() => {
    if (state.rowSelection.selectedRowKeys.length === 0) {
      Message.error('请至少选择一条数据');
      return;
    }
    setState({ auditLoading: false });
    commitAudit({ settleIds: state.rowSelection.selectedRowKeys.join(','), operationType: 1 })
      .then(() => {
        Message.success('操作成功');
        refresh();
        state.rowSelection.selectedRowKeys = []; // 清空复选框
      })
      .finally(() => {
        setState({ auditLoading: false });
      });
  }, [state, setState, refresh]);

  // 导出
  const exportRequest = useRequest(doExport, { manual: true });
  const { run } = exportRequest;
  const exportLoading = exportRequest.loading;

  // 姓名/工号
  const renderName = (value: string, index: number, { name, code }: Record) => {
    return (
      <span>
        {name}
        <br />
        {code}
      </span>
    );
  };
  // 上下班时间
  const renderTime = (value: string, index: number, { checkInTime, checkOutTime }: Record) => {
    return (
      <span>
        {checkInTime}
        <br /> {checkOutTime}
      </span>
    );
  };
  // 上下班打卡时间
  const renderClockTime = (value: string, index: number, { validClockRecord }: Record) => {
    const startTime = validClockRecord.filter((e) => e.type === 1);
    const hasStart = startTime.length > 0;
    const endTime = validClockRecord.filter((e) => e.type === 2);
    const hasEnd = endTime.length > 0;
    return (
      <span>
        {hasStart ? `${startTime[0].checkTime} 上班` : ''}
        <br />
        {hasEnd ? `${endTime[0].checkTime} 下班` : ''}
      </span>
    );
  };

  // 时间转换
  const setTime = (key, value) => {
    const data = value ? moment(value).format('YYYY-MM-DD') : '';
    return field.setValue(key, data);
  };

  // 显示title
  const showTitle = (value: string, index: number, { remark }: Record) => {
    return (
      <div className={styles.blockHidden} title={remark}>
        {remark}
      </div>
    );
  };

  // 操作栏按钮
  const cellOperation = (...args: any[]): React.ReactNode => {
    const record: Record = args[2];
    return (
      <div>
        <Button text type="primary" onClick={() => operationCallback({ actionType: 'edit', dataSource: record })}>
          编辑
        </Button>
        <Divider direction="ver" />
        <Button text type="primary" onClick={() => operationCallback({ actionType: 'log', dataSource: record })}>
          日志
        </Button>
      </div>
    );
  };

  return (
    <div>
      <Card free className={styles.container} id="table-container">
        <Card.Content>
          <Form className={styles.searchform} fullWidth labelAlign="top" field={field}>
            <ResponsiveGrid gap={10}>
              <Cell colSpan={3} rowSpan={2}>
                <FormItem label="工号/姓名">
                  <Input.TextArea
                    name="codeOrName"
                    rows={7}
                    placeholder="1、可单个或批量姓名/工号输入，单次查询仅支持输入100个姓名/工号。2、姓名/工号与姓名/工号之间用换行符隔开。"
                  />
                </FormItem>
              </Cell>
              <Cell colSpan={3}>
                <FormItem label="审核状态">
                  <Select name="checkStatus" dataSource={CHECK_STATUS} />
                </FormItem>
              </Cell>
              <Cell colSpan={3}>
                <FormItem label="出勤状态">
                  <Select name="attendanceStatus" dataSource={ATTEND_STATUS} />
                </FormItem>
              </Cell>
              <Cell colSpan={3}>
                <FormItem label="出勤日期">
                  <Row>
                    <FormItem>
                      <DatePicker
                        format="YYYY-MM-DD"
                        defaultValue={beforeNowDate}
                        name="attDateStart"
                        onChange={(value) => setTime('attDateStart', value)}
                      />
                    </FormItem>
                    <span style={{ margin: '0 10px' }}>—</span>
                    <FormItem>
                      <DatePicker
                        format="YYYY-MM-DD"
                        defaultValue={nowDate}
                        name="attDateEnd"
                        onChange={(value) => setTime('attDateEnd', value)}
                      />
                    </FormItem>
                  </Row>
                </FormItem>
              </Cell>
              <Cell colSpan={2}>
                <FormItem label="旷工">
                  <Select name="absent" dataSource={ABSENT_STATUS} />
                </FormItem>
              </Cell>

              <Cell colSpan={2}>
                <FormItem label="类型">
                  <Select name="empType" dataSource={HR_STATUS} />
                </FormItem>
              </Cell>
              <Cell colSpan={2}>
                <FormItem className={styles.handleBtn}>
                  <Form.Submit
                    type="primary"
                    onClick={submit}
                    validate
                    style={{ marginRight: '20px' }}
                    loading={loading}
                  >
                    查询
                  </Form.Submit>
                  <Form.Reset onClick={doReset}>重置</Form.Reset>
                </FormItem>
              </Cell>
            </ResponsiveGrid>
          </Form>
        </Card.Content>
        <Card.Content>
          <div className={styles.actionBar}>
            <div className={styles.buttonGroup}>
              {/* <Auth authKey="btn:export"> */}
              <Button type="primary" onClick={() => operationCallback({ actionType: 'clockIn', dataSource: null })}>
                调整打卡时间
              </Button>
              {/* </Auth> */}
              {/* <Auth> */}
              <Button type="primary" onClick={() => operationCallback({ actionType: 'rest', dataSource: null })}>
                调整休息时长
              </Button>
              {/* </Auth> */}
              {/* <Auth> */}
              <Button type="primary" onClick={() => operationCallback({ actionType: 'commute', dataSource: null })}>
                调整上下班时间
              </Button>
              {/* </Auth> */}
              {/* <Auth> */}
              <Button type="primary" onClick={() => operationCallback({ actionType: 'absenteeism', dataSource: null })}>
                旷工
              </Button>
              {/* </Auth> */}
              {/* <Auth> */}
              <Button type="primary" onClick={() => run(field.getValues())} loading={exportLoading}>
                导出
              </Button>
              {/* </Auth> */}
              {/* <Auth> */}
              <Button type="primary" onClick={() => operationCallback({ actionType: 'import', dataSource: null })}>
                导入
              </Button>
              {/* </Auth> */}
              {/* <Auth> */}
              <Button type="primary" onClick={() => doCommitAudit()} loading={state.auditLoading}>
                提交审核
              </Button>
              {/* </Auth> */}
            </div>
          </div>
          <Table {...tableProps} rowSelection={state.rowSelection} fixedHeader maxBodyHeight={600}>
            <Table.Column title="审核状态" dataIndex="checkStatusStr" width={100} lock />
            <Table.Column title="组织" dataIndex="orgName" width={100} lock />
            <Table.Column title="姓名/工号" dataIndex="name" cell={renderName} width={200} lock />
            <Table.Column title="类型" dataIndex="empTypeStr" width={100} />
            <Table.Column title="出勤日期" dataIndex="date" width={150} />
            <Table.Column title="班次ID" dataIndex="shiftId" width={100} />
            <Table.Column title="上/下班时间" dataIndex="time" cell={renderTime} width={150} />
            <Table.Column title="上/下班打卡时间" dataIndex="clockInTime" cell={renderClockTime} width={200} />
            <Table.Column title="出勤状态" dataIndex="attendanceStatusStr" width={100} />
            <Table.Column title="工时属性" dataIndex="shiftTypeStr" width={100} />
            <Table.Column title="结算工时" dataIndex="settleWorkingHour" width={100} />
            <Table.Column title="休息时长" dataIndex="restDurationHour" width={100} />
            <Table.Column title="旷工记录" dataIndex="absentStr" width={100} />
            <Table.Column title="备注" dataIndex="remark" width={100} cell={showTitle} />
            <Table.Column title="操作" cell={cellOperation} width={150} />
          </Table>
          <FpxPagination {...paginationProps} />
        </Card.Content>
      </Card>
      <OperationDialog
        dataSource={state.dataSource}
        actionType={state.actionType}
        visible={state.actionVisible}
        doOk={handleOk}
        onClose={handleCancel}
        onCancel={handleCancel}
        okProps={{ loading: state.okLoading }}
      />
    </div>
  );
};

export default AttendTable;
