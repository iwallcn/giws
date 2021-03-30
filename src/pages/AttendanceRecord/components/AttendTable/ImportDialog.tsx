import React, { useCallback } from 'react';
import { Button, Upload, Icon, Message, Loading, Dialog } from '@fpxfd/next';

import styles from './index.module.scss';
import { useSetState } from 'ahooks';
import { doAbnormalExport } from './index.service';

const ImportDialog: React.FunctionComponent = (): JSX.Element => {
  const [state, setState] = useSetState({
    visible: false,
  });

  // 拿到返回结果
  const onSuccess = useCallback(
    (res) => {
      setState({
        visible: false,
      });
      if (res.response.code === '0000000') {
        Message.success('导入成功');
        return;
      }
      if (res.response.code === '0000001' && res.response.data) {
        Dialog.alert({
          title: res.response.message.split('|')[0],
          content: res.response.message.split('|')[1],
          okProps: { children: '下载' },
          onOk: () => doAbnormalExport(res.response.data),
        });
        return;
      }
      Message.error(res.response.message || '上传失败');
    },
    [setState],
  );

  // 开始上传
  const onProgress = useCallback(() => {
    setState({
      visible: true,
    });
  }, [setState]);

  const uploadUrl =
    process.env.NODE_ENV === 'development' ? '/api/settle/groupleader/importExcel' : '/settle/groupleader/importExcel';

  return (
    <Loading tip="上传中..." visible={state.visible} className={styles.uploadLoading}>
      <div>
        <p>单次最多导入2000条记录，超出请分批次导入</p>
        <Upload.Dragger accept="xlsx, xls" action={uploadUrl} onSuccess={onSuccess} onProgress={onProgress}>
          <div className="next-upload-drag" style={{ padding: '40px 0 50px', marginRight: '20px' }}>
            <p className="next-upload-drag-icon">
              <Icon type="upload" />
            </p>
            <p className="next-upload-drag-text">点击或拖拽文件到这里上传</p>
            <p>
              <Button type="primary">选择文件</Button>
            </p>
          </div>
        </Upload.Dragger>
      </div>
    </Loading>
  );
};

export default ImportDialog;
