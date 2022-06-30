import MarkdownPreview from '@uiw/react-markdown-preview';
import { getMetaId, isMeta, getURLParameters } from 'markdown-react-code-preview-loader';
import { Root, Element, RootContent } from 'hast';
import { Loader } from 'uiw';
import CodeLayout from 'react-code-preview-layout';
import useMdData from '../../components/useMdData';

export function ExamplePage() {
  const { mdData, loading } = useMdData((path) => import(`./App${path}.md`));
  return (
    <Loader style={{ width: '100%' }} loading={loading} tip="loading...">
      <MarkdownPreview
        disableCopy={true}
        source={mdData.source}
        rehypeRewrite={(node: Root | RootContent, index: number, parent: Root | Element) => {
          if (node.type === 'element' && parent && parent.type === 'root' && /h(1|2|3|4|5|6)/.test(node.tagName)) {
            const child = node.children && (node.children[0] as Element);
            if (child && child.properties && child.properties.ariaHidden === 'true') {
              child.children = [];
            }
          }
        }}
        components={{
          code: ({ inline, node, ...props }) => {
            const { 'data-meta': meta, ...rest } = props as any;
            if (inline || !isMeta(meta)) {
              return <code {...props} />;
            }
            const line = node.position?.start.line;
            const metaId = getMetaId(meta) || String(line);
            const Child = mdData.components[`${metaId}`];
            if (metaId && typeof Child === 'function') {
              const code = mdData.data[metaId].value || '';
              const param = getURLParameters(meta);
              return (
                <CodeLayout
                  disableCheckered
                  toolbar={param.title || 'Example Preview'}
                  code={<code {...rest} />}
                  text={code}
                >
                  <Child />
                </CodeLayout>
              );
            }
            return <code {...rest} />;
          },
        }}
      />
    </Loader>
  );
}
