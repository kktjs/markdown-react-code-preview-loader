import MarkdownPreview from '@uiw/react-markdown-preview';
import mdStr from 'markdown-react-code-preview-loader/README.md';

export function HomePage() {
  return <MarkdownPreview source={mdStr.source} />;
}
