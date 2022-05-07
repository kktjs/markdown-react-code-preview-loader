import { useEffect, useState } from 'react';
import { CodeBlockData } from 'markdown-react-code-preview-loader';
import { useTranslation } from 'react-i18next';

const useMdData = (path: (lang: string) => Promise<{ default: CodeBlockData }>, name: string = 'language') => {
  const init = useTranslation();
  const [mdData, setMdData] = useState<CodeBlockData>({
    source: '',
    components: {},
    codeBlock: {},
    languages: {},
  });
  const lang = init.t(name);
  useEffect(() => {
    const getMd = async () => {
      try {
        const result = await path(lang);
        if (result.default) {
          setMdData(result.default);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    getMd();
  }, [lang, path]);
  return mdData;
};

export default useMdData;
