import React, { ReactNode } from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import { ConfigProvider } from '@fpxfd/next';

// 引入 react-intl 多语言包
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

// 引入基础组件的语言包
import enUS from '@fpxfd/next/lib/locale/en-us';
import zhCN from '@fpxfd/next/lib/locale/zh-cn';

// 引入 locale 配置文件
import localeEnUS from '@/locales/en-US';
import localeZhCN from '@/locales/zh-CN';

// 设置语言包
addLocaleData([...en, ...zh]);

const localeInfo = {
  'zh-CN': {
    nextLocale: zhCN,
    appLocale: 'zh',
    appMessages: localeZhCN,
  },
  'en-US': {
    nextLocale: enUS,
    appLocale: 'en',
    appMessages: localeEnUS,
  },
};

interface Props {
  locale: string;
  children: React.ReactElement | ReactNode;
}

function LocaleProvider(props: Props) {
  const { locale, children } = props;

  const myLocale = localeInfo[locale] ? localeInfo[locale] : localeInfo['en-US'];

  return (
    <IntlProvider locale={myLocale.appLocale} messages={myLocale.appMessages}>
      <ConfigProvider locale={myLocale.nextLocale}>{React.Children.only(children)}</ConfigProvider>
    </IntlProvider>
  );
}

export default LocaleProvider;
