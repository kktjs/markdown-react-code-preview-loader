import React from 'react';
import { FC, PropsWithChildren, useRef } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { getMetaId, getURLParameters, CodeBlockData } from 'markdown-react-code-preview-loader';

import { Root, Element, RootContent } from 'hast';
import MDSource from 'pkg-example/README.md';
import CodeLayout from 'react-code-preview-layout';

const Preview = CodeLayout.Preview;
const Code = CodeLayout.Code;
const Toolbar = CodeLayout.Toolbar;

interface CodePreviewProps {
  mdData?: CodeBlockData;
  'data-meta'?: string;
}

const CodePreview: FC<PropsWithChildren<CodePreviewProps>> = (props) => {
  const $dom = useRef<HTMLDivElement>(null);
  // @ts-ignore
  const { mdData, node, 'data-meta': meta, ...rest } = props;
  // @ts-ignore
  const line = node?.position?.start.line;
  const metaId = getMetaId(meta) || String(line);
  const Child = mdData?.components[`${metaId}`];
  if (metaId && typeof Child === 'function') {
    const code = mdData?.data[metaId].value || '';
    const param = getURLParameters(meta || '');
    return (
      <CodeLayout ref={$dom}>
        <Preview>
          <Child />
        </Preview>
        <Toolbar text={code}>{param.title || 'Example'}</Toolbar>
        <Code>
          <pre {...rest} />
        </Code>
      </CodeLayout>
    );
  }
  return <code {...rest} />;
};

export function PkgExamplePage() {
  return (
    <MarkdownPreview
      disableCopy={true}
      style={{ background: 'transparent' }}
      source={MDSource.source}
      rehypeRewrite={(node: Root | RootContent, index: number, parent: Root | Element) => {
        if (node.type === 'element' && parent && parent.type === 'root' && /h(1|2|3|4|5|6)/.test(node.tagName)) {
          const child = node.children && (node.children[0] as Element);
          if (child && child.properties && child.properties.ariaHidden === 'true') {
            child.children = [];
          }
        }
      }}
      components={{
        code: (props) => <CodePreview {...props} mdData={MDSource} />,
      }}
    />
  );
}
