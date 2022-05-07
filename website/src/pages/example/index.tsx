import { useEffect, useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { CodeBlockData } from 'markdown-react-code-preview-loader';
import PreView from '../../components/CodeLayout';

const getMetaData = (meta: string) => {
  if (meta) {
    const [metaItem] = /mdx:(.[\w|:]+)/i.exec(meta) || [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, field, val] = (metaItem || '').split(':').map((item) => item.trim());
    if (val) {
      return val;
    }
  }
  return '';
};

export function ExamplePage() {
  const [mdData, setMdData] = useState<CodeBlockData>({
    source: '',
    components: {},
    codeBlock: {},
    languages: {},
  });

  const [lang] = useState('');
  useEffect(() => {
    const getMd = async () => {
      // const result = await import(`@uiw/react-layout/README${lang}.md`);
      const result = await import(`./App${lang}.md`);
      console.log(result);
      if (result.default) {
        setMdData(result.default);
      }
    };
    getMd();
  }, [lang]);
  return (
    <div>
      <MarkdownPreview
        source={mdData.source}
        components={{
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
            const line = node.position?.start.line;
            const funName = getMetaData(meta || '') || line;
            const Child = mdData.components[funName || ''];
            if (funName && typeof Child === 'function') {
              const copyNodes = mdData.codeBlock[funName] || '';
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
