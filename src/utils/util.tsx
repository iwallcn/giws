import { ColumnProps } from '@fpxfd/next/types/table';

function getColumnKey(column: ColumnProps & { key?: string }): string | null {
  if (column) {
    return column.key || String(column.title) || column.dataIndex;
  }
  return null;
}

/**
 * 流文件下载
 * @param res 字节流
 * @param filename 文件名
 * @returns
 */
const blobToExcel = (res, filename) => {
  const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  const d = new Date();
  if (filename) filename += '.xlsx';
  a.download = filename || `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}.xlsx`;
  a.href = blobUrl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
};

export { blobToExcel, getColumnKey };
