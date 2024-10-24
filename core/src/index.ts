import React from 'react';
import { type LoaderDefinitionFunction } from 'webpack';
import { type PluginItem } from '@babel/core';
import { type Options as RIOptions } from 'babel-plugin-transform-remove-imports';
import { getProcessor, getCodeBlock, getHeadings, type HeadingItem, type HeadingListType } from './utils';

export * from './utils';

export type CodeBlockItem = {
  /** The code after the source code conversion. **/
  code?: string;
  /** original code block **/
  value?: string;
  /** code block programming language **/
  language?: string;
  /** The index name, which can be customized, can be a row number. */
  name?: string | number;
  /** The `meta` parameter is converted into an `object`. */
  meta?: Record<string, string>;
};

export type CodeBlockData = {
  source: string;
  components: Record<CodeBlockItem['name'], React.FC>;
  data: Record<CodeBlockItem['name'], CodeBlockItem>;
  headings?: HeadingItem[];
  headingsList?: HeadingListType[];
};

export const FUNNAME_PREFIX = '__BaseCode__';

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
  /**是否进行标题解析*/
  isHeading?: boolean;
};

const codePreviewLoader: LoaderDefinitionFunction = function (source) {
  const options: Options = this.getOptions();
  const { isHeading, ...rest } = options;

  let components = '';
  let codeBlock = {} as CodeBlockData['data'];
  const child = getProcessor(source);
  try {
    codeBlock = getCodeBlock(child, rest, this.resourcePath);
    Object.keys(codeBlock).forEach((key) => {
      components += `${key}: (function() { ${codeBlock[key].code} })(),`;
    });
  } catch (error) {
    this.emitError(error);
  }

  const { headingsList, headings } = isHeading ? getHeadings(child) : { headingsList: [], headings: [] };

  return `\nexport default {
    components: { ${components} },
    data: ${JSON.stringify(codeBlock, null, 2)},
    source: ${JSON.stringify(source)},
    headings:${JSON.stringify(headings)},
    headingsList:${JSON.stringify(headingsList)},
  }`;
};

export default codePreviewLoader;
