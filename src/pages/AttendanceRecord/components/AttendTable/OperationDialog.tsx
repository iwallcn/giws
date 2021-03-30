import React, { useCallback, useEffect } from 'react';
import {
  Select,
  Form,
  Field,
  Input,
  Dialog,
  Radio,
  Table,
  Grid,
  DatePicker,
  TimePicker,
  Button,
  Loading,
  Upload,
  Message,
} from '@fpxfd/next';
import { DialogProps } from '@fpxfd/next/types/dialog';
import { OperaitionProps, Record } from './index.interface';
import { SHIFT_STATUS } from '@/const';
import moment from 'moment';
import ImportDialog from './ImportDialog';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Row, Col } = Grid;

const OperationDialog: React.FC<OperaitionProps & DialogProps> = (props): JSX.Element => {
  const { actionType, dataSource, doOk = () => {}, ...lastProps } = props;
  const field = Field.useField([]);

  const isImport = actionType === 'import';
  const isLog = actionType === 'log';
  const isEdit = actionType === 'edit';

  const dialogTitle = {
    clockIn: '调整打卡时间',
    commute: '调整上下班时间',
    rest: '调整休息时间',
    absenteeism: '旷工记录',
    edit: '编辑',
    log: '日志记录',
    import: '导入',
  };
  // 宽度
  const DialogWidth = {
    log: '600px',
    import: '600px',
  };

  const momentToString = (value: string, format = 'YYYY-MM-DD HH:mm') => (value ? moment(value).format(format) : '');

  const stringToMoment = (value: string, format = 'HH:mm:ss') => (value ? moment(value, format, true) : '');

  // 回显数据转换
  const inFormTransform = {
    checkInTime: (value) => stringToMoment(value),
    checkOutTime: (value) => stringToMoment(value),
    shiftType: (value) => value || 1,
    restDuration: (value) => (value || 0) / 3600,
    clockInTime: (data, source: Record) => {
      const { validClockRecord } = source;
      if (validClockRecord.length === 0) return '';
      const startData = validClockRecord.filter((e) => e.type === 1);
      if (startData.length === 0) return '';
      return stringToMoment(startData[0].checkTime, 'YYYY-MM-DD HH:mm:ss');
    },
    clockOutTime: (data, source: Record) => {
      const { validClockRecord } = source;
      if (validClockRecord.length === 0) return '';
      const endData = validClockRecord.filter((e) => e.type === 2);
      if (endData.length === 0) return '';
      return stringToMoment(endData[0].checkTime, 'YYYY-MM-DD HH:mm:ss');
    },
  };

  // 抛出数据转换
  const outFormTransform = {
    checkInTime: (value: string) => momentToString(value, 'HH:mm'),
    checkOutTime: (value: string) => momentToString(value, 'HH:mm'),
    restDuration: (value: string) => Number(value || 0) * 3600,
    clockInTime: (value: string) => momentToString(value),
    clockOutTime: (value: string) => momentToString(value),
  };

  useEffect(() => {
    field.reset();
    // 编辑回显
    if (isEdit && dataSource) {
      for (const key in dataSource) {
        // 有转换规则并且有数据才转换
        if (inFormTransform[key]) {
          field.setValue(key, inFormTransform[key](dataSource[key], dataSource));
        } else {
          field.setValue(key, dataSource[key]);
        }
      }
    }
  }, [field, dataSource]);

  //
  const handleOk = useCallback(() => {
    field.validate((errors, values) => {
      if (errors) return;
      const outDatas = { ...values };
      for (const key in outDatas) {
        // 有转换规则并且有数据才转换
        if (outFormTransform[key]) {
          outDatas[key] = outFormTransform[key](outDatas[key]);
        }
      }
      doOk(outDatas);
    });
  }, [doOk]);

  // 校验规则
  const validateRules = {
    restDurationPatten: /^([1-9]\d*(\.[0-9]{1})?|0(\.\d{1})?)$/,
    restDurationPattenMsg: '请输入小数点后不超过一位数的非负数',
  };

  // 操作人/工号
  const renderOperationName = (value: string, index: number, record) => {
    return (
      <span>
        {record.operationName}/{record.operationId}
      </span>
    );
  };

  // 日志
  const logContent = (
    <>
      <Table dataSource={dataSource as any[]}>
        <Table.Column title="操作人/工号" dataIndex="operationName" cell={renderOperationName} width="140px" />
        <Table.Column title="操作内容" dataIndex="operationDetail" />
        <Table.Column title="操作日期" dataIndex="operationTime" width="160px" />
      </Table>
    </>
  );

  // 调整打卡时间
  const clockContent = (
    <>
      <FormItem label="上班打卡时间:" required requiredMessage="必填">
        <DatePicker name="clockInTime" showTime={{ format: 'HH:mm' }} />
      </FormItem>
      <FormItem label="下班打卡时间:" required requiredMessage="必填">
        <DatePicker name="clockOutTime" showTime={{ format: 'HH:mm' }} />
      </FormItem>
      <FormItem label="备注:" requiredMessage="必填">
        <Input.TextArea name="remark" />
      </FormItem>
    </>
  );

  // 调整上下班时间
  const commuteContent = (
    <>
      <FormItem label="上班时间:" required requiredMessage="必填">
        <TimePicker format="HH:mm" name="checkInTime" />
      </FormItem>
      <FormItem label="下班时间:" required requiredMessage="必填">
        <TimePicker format="HH:mm" name="checkOutTime" />
      </FormItem>
    </>
  );

  // 调整休息时长
  const restContent = (
    <>
      <FormItem
        label="休息时长:"
        required
        requiredMessage="必填"
        pattern={validateRules.restDurationPatten}
        patternMessage={validateRules.restDurationPattenMsg}
      >
        <Input name="restDuration" style={{ display: 'inline-block', width: '90%' }} /> 小时
      </FormItem>
    </>
  );

  // 调整旷工记录
  const absenteeismContent = (
    <>
      <FormItem label="旷工记录:" required requiredMessage="必填">
        <RadioGroup name="absent">
          <Radio value="0">无</Radio>
          <Radio value="1">旷工0.5天</Radio>
          <Radio value="2">旷工1天</Radio>
        </RadioGroup>
      </FormItem>
    </>
  );

  // 编辑
  const editContent = (
    <>
      <FormItem>
        <Row>
          <FormItem
            label="上班时间:"
            // required
            // requiredMessage="必填"
            style={{ marginRight: '10px', marginBottom: 0 }}
          >
            <TimePicker format="HH:mm" name="checkInTime" />
          </FormItem>
          <FormItem
            label="下班时间:"
            // required
            // requiredMessage="必填"
            style={{ marginBottom: 0 }}
          >
            <TimePicker format="HH:mm" name="checkOutTime" />
          </FormItem>
        </Row>
      </FormItem>
      <FormItem>
        <Row>
          <FormItem
            label="上班打卡时间:"
            // required
            // requiredMessage="必填"
            style={{ marginRight: '10px', marginBottom: 0 }}
          >
            <DatePicker name="clockInTime" showTime={{ format: 'HH:mm' }} />
          </FormItem>
          <FormItem
            label="下班打卡时间:"
            // required
            // requiredMessage="必填"
            style={{ marginBottom: 0 }}
          >
            <DatePicker name="clockOutTime" showTime={{ format: 'HH:mm' }} />
          </FormItem>
        </Row>
      </FormItem>
      <FormItem
        label="休息时长:"
        pattern={validateRules.restDurationPatten}
        patternMessage={validateRules.restDurationPattenMsg}
        // required
        // requiredMessage="必填"
      >
        <Input name="restDuration" style={{ display: 'inline-block', width: '90%' }} /> 小时
      </FormItem>

      <FormItem
        label="工时属性:"
        // required
        // requiredMessage="必填"
      >
        <Select name="shiftType" dataSource={SHIFT_STATUS} />
      </FormItem>
      <FormItem
        label="旷工记录:"
        // required
        // requiredMessage="必填"
      >
        <RadioGroup name="absent">
          <Radio value={0}>无</Radio>
          <Radio value={1}>旷工0.5天</Radio>
          <Radio value={2}>旷工1天</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="备注:" requiredMessage="必填">
        <Input.TextArea name="remark" />
      </FormItem>
    </>
  );

  //
  const renderDialogContent = () => {
    const nodeMap = {
      log: logContent,
      clockIn: clockContent,
      commute: commuteContent,
      rest: restContent,
      absenteeism: absenteeismContent,
      edit: editContent,
    };
    return nodeMap[actionType];
  };

  return (
    <>
      <Dialog
        title={dialogTitle[actionType]}
        {...lastProps}
        style={{ width: DialogWidth[actionType] || '400px' }}
        onOk={handleOk}
        footer={
          isLog || isImport ? (
            <Button type="primary" onClick={(e) => props.onClose!('1', e)}>
              关闭
            </Button>
          ) : (
            true
          )
        }
      >
        <Form fullWidth labelAlign={'top'} field={field} {...formItemLayout}>
          {isImport ? <ImportDialog /> : renderDialogContent()}
        </Form>
      </Dialog>
    </>
  );
};

export default OperationDialog;
