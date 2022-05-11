import React from 'react';
import { PluginItem } from '@babel/core';
import { Options as RIOptions } from 'babel-plugin-transform-remove-imports';
import { getCodeBlockString } from './utils';
export * from './utils';

export type CodeBlockData = {
  source: string;
  components: Record<string | number, React.FC>;
  codeBlock: Record<string | number, string>;
  languages: Record<string | number, string>;
};

export type Options = {
  /**
   * Language to parse code blocks, default: `["jsx","tsx"]`
   */
  lang?: string[];
  /**
   * Option settings for the babel (babel-plugin-transform-remove-imports) package
   * https://github.com/uiwjs/babel-plugin-transform-remove-imports
   */
  removeImports?: RIOptions;
  /**
   * Add babel plugins.
   */
  babelPlugins?: PluginItem[];
};

export default function (source: string) {
  const options: Options = this.getOptions();
  const result = getCodeBlockString(source, options);

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
