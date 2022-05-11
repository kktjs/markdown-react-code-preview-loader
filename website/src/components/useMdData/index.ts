import { useEffect, useState } from 'react';
import { CodeBlockData } from 'markdown-react-code-preview-loader';
import { useTranslation } from 'react-i18next';

const useMdData = (path: (lang: string) => Promise<{ default: CodeBlockData }>, name: string = 'md-language-name') => {
  const init = useTranslation();
  const [mdData, setMdData] = useState<CodeBlockData>({
    source: '',
    components: {},
    data: {},
  });
  const lang = init.t(name);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(() => true);
    const getMd = async () => {
      try {
        const result = await path(lang);
        console.log('result:', result.default);
        if (result.default) {
          setMdData(result.default);
        }
      } catch (err) {
        console.warn(err);
      }
      setLoading(() => false);
    };
    getMd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);
  return { mdData, loading };
};

export default useMdData;
