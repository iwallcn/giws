import Table, { ColumnProps } from '@fpxfd/next/lib/table';
import { ItemInterface } from 'react-sortablejs';

export type ActionType = 'clockIn' | 'edit' | 'log' | 'rest' | 'commute' | 'absenteeism' | 'import';

export type Column = ColumnProps &
  ItemInterface & {
    id?: string | number;
    children?: Column[];
  };

export interface Record {
  id: number;
  orgCode: string;
  orgName: string;
  code: string;
  name: string;
  empType: string;
  empTypeStr: string;
  date: string;
  shiftId: string;
  shiftType: string;
  shiftTypeStr: string;
  settleTime: string;
  checkInTime: string;
  checkOutTime: string;
  clockInTime: string;
  clockOutTime: string;
  restDuration: number;
  settleRule: string;
  settleWorkingDuration: number;
  settleWorkingHour: string;
  absent: string;
  absentStr: string;
  attendanceStatus: string;
  attendanceStatusStr: string;
  checkStatus: number;
  checkStatusStr: string;
  remark: string;
  commitNum: number;
  submitEndTime: string;
  auditEndTime: string;
  leaderCode: string;
  leaderName: string;
  companyId: string;
  companyName: string;
  restDurationHour: string;
  metaClockRecord: string;
  validClockRecord: any[];
}

export interface DialogState {
  actionType: ActionType;
  actionVisible: boolean;
  dataSource: any;
  okLoading: boolean;
  rowSelection: any;
  auditLoading: boolean;
  orgCode: number[];
}

export interface OperaitionProps {
  /**
   * 操作类型, 以此来标识是添加、编辑、还是查看
   */
  actionType: ActionType;

  /**
   * 数据源
   */
  dataSource: Record | null | any[] | any;
  /**
   * 点击确认
   */
  doOk?: (data) => void;
}
