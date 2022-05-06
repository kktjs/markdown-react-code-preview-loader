import React from 'react';
import { Button } from 'uiw';
const language = {
  en: {
    label: '英文',
    value: '',
  },
  zh: {
    label: '中文',
    value: '-zh',
  },
};

export default function App() {
  const [lang, setLang] = React.useState('');
  const [mdData, setMdData] = React.useState({ source: '', BaseCodeData: {} });
  React.useEffect(() => {
    const getMd = async () => {
      const result = await import(`./App${lang}.md`);
      if (result.default) {
        setMdData(result.default);
      }
    };
    getMd();
  }, [lang]);
  return (
    <div>
      {Object.entries(language).map(([_, item]) => {
        return (
          <Button type={lang === item.value ? 'primary' : 'light'} key={_} onClick={() => setLang(`${item.value}`)}>
            {item.label}
          </Button>
        );
      })}
      {Object.entries(mdData.BaseCodeData || {}).map(([key, BaseCode]) => {
        if (typeof BaseCode === 'function') {
          return <React.Fragment key={key}>{BaseCode()}</React.Fragment>;
        }
        return <React.Fragment key={key} />;
      })}
    </div>
  );
}
