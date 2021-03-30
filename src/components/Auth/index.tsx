import React, { useEffect } from 'react';
import { useSetState } from 'ahooks';
import store from '@/store';

function Auth({ children, authKey }) {
  const [state, setState] = useSetState({
    hasAuth: true
  })
  useEffect(() => {
    const [permission] = store.useModel('permission');
    if (!permission.btnPermissions.includes(authKey)) {
      setState({
        hasAuth: false
      })
    }
  }, [])

  // 有权限时直接渲染内容 或者没传authKey默认展示
  if (state.hasAuth || !authKey) {
    return children;
  } else {
    // 无权限时显示指定 UI
    return <></>
  }
}

export default Auth;