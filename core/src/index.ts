import { getCodeBlockString } from './utils';
export * from './utils';
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
