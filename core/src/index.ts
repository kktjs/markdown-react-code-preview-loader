import { getCodeBlockString } from './utils';
import React from 'react';
export * from './utils';

export type CodeBlockData = {
  source: string;
  components: Record<string | number, React.FC>;
  codeBlock: Record<string | number, string>;
  languages: Record<string | number, string>;
};

export default function (source: string) {
  const options = this.getOptions();
  const result = getCodeBlockString(source, options.lang || ['tsx', 'jsx']);
  return `
    ${result}
    export default {
      source:${JSON.stringify(source)},
      components,
      codeBlock,
      languages
    }
`;
}
