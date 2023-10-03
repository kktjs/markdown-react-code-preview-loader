import MarkdownPreview from '@uiw/react-markdown-preview';
import { Root, Element, RootContent } from 'hast';
import { Loader } from 'uiw';
import useMdData from './../../components/useMdData';

export function HomePage() {
  const { mdData, loading } = useMdData((path) => {
    return import(`markdown-react-code-preview-loader/README${path}.md`);
  });
  return (
    <Loader style={{ width: '100%' }} loading={loading} tip="loading...">
      <MarkdownPreview
        source={mdData.source}
        style={{ background: 'transparent' }}
        rehypeRewrite={(node: Root | RootContent, index: number, parent: Root | Element) => {
          if (node.type === 'element' && parent && parent.type === 'root' && /h(1|2|3|4|5|6)/.test(node.tagName)) {
            const child = node.children && (node.children[0] as Element);
            if (child && child.properties && child.properties.ariaHidden === 'true') {
              child.children = [];
            }
          }
        }}
      />
    </Loader>
  );
}
