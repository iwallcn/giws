import React from 'react';
import { ResponsiveGrid } from '@fpxfd/next';
import PageHeader from '@/components/PageHeader';
import AttendTable from './components/AttendTable';
import { FormattedMessage } from 'react-intl';

const { Cell } = ResponsiveGrid;

const FusionAttendanceRecordTable = () => {
  return (
    <ResponsiveGrid>
      <Cell colSpan={12}>
        <PageHeader title={<FormattedMessage id="出差" />} />
      </Cell>
      <Cell colSpan={12}>
        <AttendTable />
        <FormattedMessage id="哈哈" />
      </Cell>
    </ResponsiveGrid>
  );
};

export default FusionAttendanceRecordTable;
