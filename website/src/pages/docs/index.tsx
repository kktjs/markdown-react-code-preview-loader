import MarkdownPreview from '@uiw/react-markdown-preview';
import useMdData from './../../components/useMdData';
import { Loader } from 'uiw';
import styles from './../index.module.less';
export function HomePage() {
  const { mdData, loading } = useMdData((path) => {
    return import(`markdown-react-code-preview-loader/README${path}.md`);
  });
  return (
    <Loader style={{ width: '100%' }} loading={loading} tip="loading...">
      <div>
        <MarkdownPreview className={styles.markdown} source={mdData.source} />
      </div>
    </Loader>
  );
}
