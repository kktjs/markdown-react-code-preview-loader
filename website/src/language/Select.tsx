import React from 'react';
import languageData from './language.json';
import { Select } from 'uiw';
import { useTranslation } from 'react-i18next';

const Language = () => {
  const { i18n } = useTranslation();
  const Options = React.useMemo(() => {
    return Object.entries(languageData).map(([key, item]) => {
      return (
        <Select.Option key={key} value={key}>
          {item.label}
        </Select.Option>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(languageData)]);

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
