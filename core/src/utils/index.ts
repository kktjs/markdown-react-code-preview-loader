import { Parent, Node } from 'unist';
import { getTransformValue } from './transform';
import webpack from 'webpack';
import remark from 'remark';
import { Options, FUNNAME_PREFIX, CodeBlockItem, CodeBlockData } from '../';

export interface MarkdownDataChild extends Node {
  lang: string;
  meta: string;
  value: string;
}

export interface MarkdownParseData extends Parent<MarkdownDataChild> {}

/** 转换 代码*/
export const getProcessor = (source: string) => {
  try {
    const child = remark.parse(source) as MarkdownParseData;
    return child.children;
  } catch (err) {
    console.warn(err);
  }
};

/**
 * ```js
 * 'mdx:preview' => ''  // Empty
 * 'mdx:preview:demo12' => 'demo12' // return meta id => 'demo12'
 * ```
 * @param meta string
 * @returns string?
 */
export const getMetaId = (meta: string = '') => {
  const [metaRaw = ''] = /mdx:(.[\w|:]+)/i.exec(meta) || [];
  return metaRaw.replace(/^mdx:preview:?/, '');
};

/**
 * ```js
 * isMeta('mdx:preview') => true
 * isMeta('mdx:preview:demo12') => true
 * isMeta('mdx:preview--demo12') => false
 * ```
 * @param meta
 * @returns boolean
 */
export const isMeta = (meta: string = '') => meta && meta.includes('mdx:preview');

/** 获取需要渲染的代码块 **/
export const getCodeBlock = (child: MarkdownParseData['children'], opts: Options = {}): CodeBlockData['data'] => {
  const { lang = ['jsx', 'tsx'] } = opts;
  // 获取渲染部分
  const codeBlock: Record<string | number, CodeBlockItem> = {};
  try {
    child.forEach((item) => {
      if (item && item.type === 'code' && lang.includes(item.lang)) {
        const line = item.position.start.line;
        const metaId = getMetaId(item.meta);
        if (isMeta(item.meta)) {
          let name = metaId || line;
          const funName = `${FUNNAME_PREFIX}${name}`;
          const returnCode = getTransformValue(item.value, `${funName}.${lang}`, opts);
          codeBlock[name] = {
            name,
            code: returnCode,
            language: item.lang,
            value: item.value,
          };
        }
      }
    });
  } catch (err) {
    console.warn(err);
  }
  return codeBlock;
};

/**
 * `mdCodeModulesLoader` method for adding `markdown-react-code-preview-loader` to webpack config.
 * @param {webpack.Configuration} config webpack config
 * @param {string[]} lang Parsing language
 * @param {Options} option Loader Options
 * @returns {webpack.Configuration}
 */
export const mdCodeModulesLoader = (
  config: webpack.Configuration,
  lang?: string[],
  option: Options = {},
): webpack.Configuration => {
  config.module.rules.forEach((ruleItem) => {
    if (typeof ruleItem === 'object') {
      if (ruleItem.oneOf) {
        ruleItem.oneOf.unshift({
          test: /.md$/,
          use: [
            {
              loader: 'markdown-react-code-preview-loader',
              options: { lang, ...option },
            },
          ],
        });
      }
    }
  });
  return config;
};
