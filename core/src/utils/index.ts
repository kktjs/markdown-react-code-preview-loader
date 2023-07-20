import { Parent, Node } from 'unist';
import webpack from 'webpack';
import remark from 'remark';
import { getTransformValue } from './transform';
import { Options, FUNNAME_PREFIX, CodeBlockItem, CodeBlockData } from '../';

/**
 * Creates an object containing the parameters of the current URL.
 *
 * ```js
 * getURLParameters('name=Adam&surname=Smith');
 * // 👉 {name: 'Adam', surname: 'Smith'}
 * ```
 * @param url `name=Adam&surname=Smith`
 * @returns
 */
export const getURLParameters = (url: string): Record<string, string> => {
  const regex = /([^?=&]+)=([^&]*)/g;
  const params: Record<string, string> = {};
  let match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
};

export interface MarkdownDataChild extends Node {
  lang: string;
  meta: string;
  value: string;
  depth?: number;
  children?: Array<MarkdownDataChild>;
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
export function getCodeBlock(
  child: MarkdownParseData['children'],
  opts: Options = {},
  resourcePath?: string,
): CodeBlockData['data'] {
  const { lang = ['jsx', 'tsx'] } = opts;
  // 获取渲染部分
  const codeBlock: Record<string | number, CodeBlockItem> = {};
  child.forEach((item) => {
    if (item && item.type === 'code' && lang.includes(item.lang)) {
      const line = item.position.start.line;
      const metaId = getMetaId(item.meta);
      if (isMeta(item.meta)) {
        let name = metaId || line;
        const funName = `${resourcePath}.${FUNNAME_PREFIX}${name}`;
        const returnCode = getTransformValue(item.value, `${funName}.${item.lang}`, opts);
        codeBlock[name] = {
          name,
          meta: getURLParameters(item.meta),
          code: returnCode,
          language: item.lang,
          value: item.value,
        };
      }
    }
  });
  return codeBlock;
}

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

export interface HeadingListType {
  depth: number;
  value: string;
}

export interface HeadingItem extends HeadingListType {
  /**嵌套子标题*/
  children?: HeadingItem[];
}

/**进行获取同级别标题数据*/
export const getSameLevelHeading = (list: HeadingListType[]) => {
  const newList: { start: number; end: number }[] = [];
  let level: number = 0;
  let satrtIndex = 0;
  let lg = list.length;

  // 对同级别数据进行区分
  for (let index = 0; index < lg; index++) {
    const element = list[index];
    if (index === 0) {
      satrtIndex = 0;
      /**默认第一个数据的层级进行查找*/
      level = element.depth;
    } else if (element.depth === level) {
      // 层级相同则进行赋值
      // 这个位置相等，说明这些数据是一组数据
      newList.push({ start: satrtIndex, end: index });
      /**重新赋值开始下标数据*/
      satrtIndex = index;
    }
  }
  // 如果最后位置没找到
  if (satrtIndex <= lg - 1) {
    newList.push({ start: satrtIndex, end: lg });
  }

  const saveList: HeadingItem[] = [];

  /**对标题数据进行处理*/
  newList.forEach((item) => {
    const { start, end } = item;
    const [firstItem, ...lastItems] = list.slice(start, end);
    const newItem: HeadingItem = { ...firstItem };
    if (Array.isArray(lastItems) && lastItems.length) {
      newItem.children = getSameLevelHeading(lastItems);
    }
    saveList.push(newItem);
  });

  return saveList;
};

/**获取标题*/
export const getHeadings = (child: MarkdownParseData['children']) => {
  const headingList: HeadingListType[] = [];

  child.forEach((item) => {
    if (item && item.type === 'heading') {
      const { depth, children } = item;
      if (Array.isArray(children) && children.length && depth) {
        const [firstItem] = children || [];
        if (firstItem && firstItem?.value) {
          headingList.push({ depth, value: firstItem?.value });
        }
      }
    }
  });

  return getSameLevelHeading(headingList);
};
