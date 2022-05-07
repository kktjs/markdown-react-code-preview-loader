import React from 'react';
import languageData from './language.json';
import { Select } from 'uiw';
import { useTranslation } from 'react-i18next';

const Language = () => {
  const { i18n, t } = useTranslation();
  const Options = React.useMemo(() => {
    return (languageData || []).map((key) => {
      return (
        <Select.Option key={key} value={key}>
          {t(key)}
        </Select.Option>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(languageData), i18n.language]);

  return (
    <div style={{ width: 100 }}>
      <Select
        value={i18n.language}
        onChange={(event) => {
          const value = event.target.value;
          i18n.changeLanguage(value);
        }}
      >
        {Options}
      </Select>
    </div>
  );
};

export default Language;
