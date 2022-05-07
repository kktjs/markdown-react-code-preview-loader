import { getCodeBlockString } from './utils';
import React from 'react';
export * from './utils';
export type MdLoaderReturn = {
  source: string;
  BaseCodeData: Record<string | number, React.FC>;
  codeBlockValue: Record<string | number, string>;
  languageData: Record<string | number, string>;
};

export default function (source: string) {
  const options = this.getOptions();
  const result = getCodeBlockString(source, options.lang || ['tsx', 'jsx']);
  return `
    ${result}
    export default {
      source:${JSON.stringify(source)},
      BaseCodeData,
      codeBlockValue,
      languageData
    }
`;
}
