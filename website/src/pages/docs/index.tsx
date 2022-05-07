import MarkdownPreview from '@uiw/react-markdown-preview';
import useMdData from './../../components/useMdData';
export function HomePage() {
  const mdData = useMdData((lang) => import(`markdown-react-code-preview-loader/README${lang}.md`));
  return <MarkdownPreview source={mdData.source} />;
}
