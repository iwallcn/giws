import * as React from 'react';
import { runApp, IAppConfig } from 'ice';
import LocaleProvider from '@/components/LocaleProvider';
import { getLocale } from '@/locales/locale';
import { Message } from '@fpxfd/next';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import packageJson from '../package.json';

const locale = getLocale();
const appConfig: IAppConfig = {
  router: {
    type: 'browser',
  },
  request: {
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : '',
    // 可选的，全局设置 request 是否返回 response 对象，默认为 false
    withFullResponse: false,
    withCredentials: true,
    // 拦截器
    interceptors: {
      request: {
        onConfig: (config) => {
          // 发送请求前：可以对 RequestConfig 做一些统一处理
          return config;
        },
        onError: (error) => {
          return Promise.reject(error);
        },
      },
      response: {
        onConfig: (response) => {
          // 请求成功：可以做全局的 toast 展示，或者对 response 做一些格式化
          // 数据流导出 返回的是数据流才执行导出否则抛出异常
          if (response.status === 200 && response.config.responseType === 'blob') {
            if (response.headers['content-type'].includes('application/octet-stream')) {
              return response;
            }
            // 异常处理
            if (!('TextDecoder' in window)) return;
            const enc = new TextDecoder('utf-8');
            const arr = new Uint8Array(response.data);
            const errData = JSON.parse(enc.decode(arr));
            response.data = errData;
          }
          // 普通请求
          if (response.data.code === '0000000') {
            return response.data;
          }
          Message.error(response.data.message || '操作失败');
          return Promise.reject(response);
        },
        onError: (err) => {
          if (err && err.response && err.response.status) {
            switch (err.response.status) {
              case 400:
                err.message = '错误请求';
                break;
              case 401:
                err.message = '未授权，请重新登录';
                break;
              case 403:
                err.message = '拒绝访问';
                break;
              case 404:
                err.message = '请求错误，未找到该资源';
                break;
              case 405:
                err.message = '请求方法未允许';
                break;
              case 408:
                err.message = '请求超时';
                break;
              case 500:
                err.message = '服务器端出错';
                break;
              case 501:
                err.message = '网络未实现';
                break;
              case 502:
                err.message = '网络错误';
                break;
              case 503:
                err.message = '服务不可用';
                break;
              case 504:
                err.message = '网络超时';
                break;
              case 505:
                err.message = 'http版本不支持该请求';
                break;
              default:
                err.message = '连接错误';
            }
          } else {
            err.message = '连接到服务器失败';
          }
          Message.error(err.message);
          return Promise.reject(err);
        },
      },
    },
  },
  app: {
    rootId: 'ice-container',
    addProvider: ({ children }) => (
      <Sentry.ErrorBoundary>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </Sentry.ErrorBoundary>
    ),
  },
};

Sentry.init({
  dsn: 'https://9f64fba5b0b14825a564c5df31222f01@10.104.6.235:9000/2',
  release: `giws@${packageJson.version}`,
  // tracingOrigins: ["localhost", "my-site-url.com", /^\//],
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    }),
  ],
  tracesSampleRate: 1.0,
});

runApp(appConfig);
