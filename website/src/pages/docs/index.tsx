import MarkdownPreview from '@uiw/react-markdown-preview';
import useMdData from './../../components/useMdData';
import { Loader } from 'uiw';
export function HomePage() {
  const { mdData, loading } = useMdData((path) => {
    return import(`markdown-react-code-preview-loader/README${path}.md`);
  });
  return (
    <Loader style={{ width: '100%' }} loading={loading} tip="loading...">
      <MarkdownPreview source={mdData.source} />
    </Loader>
  );
}
