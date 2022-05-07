import React from 'react';
import { Button } from 'uiw';
import PreView from './components/CodeLayout';
import MarkdownPreview from '@uiw/react-markdown-preview';

const language = {
  en: {
    label: '英文',
    value: '',
  },
  zh: {
    label: '中文',
    value: '-zh',
  },
};

const getMetaData = (meta: string) => {
  if (meta) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [field, name] = meta.split(':').map((item) => item.trim());
    if (name) {
      return name;
    }
  }
  return '';
};

export type MdDataType = {
  source: string;
  BaseCodeData: Record<string | number, React.FC>;
  codeBlockValue: Record<string | number, string>;
  languageData: Record<string | number, string>;
};

export default function App() {
  const [lang, setLang] = React.useState('');
  const [mdData, setMdData] = React.useState<MdDataType>({
    source: '',
    BaseCodeData: {},
    codeBlockValue: {},
    languageData: {},
  });
  React.useEffect(() => {
    const getMd = async () => {
      // const result = await import(`@uiw/react-layout/README${lang}.md`);
      const result = await import(`./App${lang}.md`);
      if (result.default) {
        setMdData(result.default);
      }
    };
    getMd();
  }, [lang]);
  console.log('mdData', mdData);
  return (
    <div>
      {Object.entries(language).map(([_, item]) => {
        return (
          <Button type={lang === item.value ? 'primary' : 'light'} key={_} onClick={() => setLang(`${item.value}`)}>
            {item.label}
          </Button>
        );
      })}

      <MarkdownPreview
        style={{ padding: '15px 15px' }}
        source={mdData.source}
        components={{
          /**
           * bgWhite 设置代码预览背景白色，否则为格子背景。
           * noCode 不显示代码编辑器。
           * noPreview 不显示代码预览效果。
           * noScroll 预览区域不显示滚动条。
           * codePen 显示 Codepen 按钮，要特别注意 包导入的问题，实例中的 import 主要用于 Codepen 使用。
           */
          code: ({ inline, node, ...props }) => {
            const {
              'data-meta': meta,
              noPreview,
              noScroll,
              bgWhite,
              noCode,
              codePen,
              codeSandboxOption,
              codeSandbox,
              ...rest
            } = props as any;

            if (inline) {
              return <code {...props} />;
            }
            // const config = {
            //   noPreview,
            //   noScroll,
            //   bgWhite,
            //   noCode,
            //   codePen,
            //   codeSandboxOption,
            // } as any;
            // if (Object.keys(config).filter((name) => config[name] !== undefined).length === 0) {
            //   return <code {...props} />;
            // }
            const line = node.position?.start.line;
            const funName = getMetaData(meta || '') || line;
            const Child = mdData.BaseCodeData[funName || ''];
            if (funName && typeof Child === 'function') {
              const copyNodes = mdData.codeBlockValue[funName] || '';
              return (
                <PreView code={<code {...rest} />} copyNodes={copyNodes}>
                  <Child />
                </PreView>
              );
            }
            return <code {...rest} />;
          },
        }}
      />
    </div>
  );
}
