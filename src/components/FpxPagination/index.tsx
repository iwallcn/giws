import React from 'react';
import { Pagination } from '@fpxfd/next';

const FpxPagination = (props) => {
  return (
    <Pagination
      style={{ marginTop: 16, textAlign: 'right' }}
      pageSizeSelector="dropdown"
      pageSizePosition="start"
      pageSizeList={[10, 20, 50]}
      popupProps={{ align: 'tl bl' }}
      {...props}
    />
  );
};

export default FpxPagination;
