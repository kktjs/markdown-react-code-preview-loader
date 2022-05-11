/*
 * @Description: markdown 转化
 */
import { MarkDownTreeType, CodeBlockItemType } from './interface';
import { getTransformValue } from './transform';
import webpack from 'webpack';
import remark from 'remark';
export * from './interface';
import { Options } from '../';

/** 转换 代码*/
const getProcessor = (scope: string) => {
  try {
    const child = remark.parse(scope) as MarkDownTreeType;
    return child.children;
  } catch (err) {
    console.warn(err);
  }
};

const getMeta = (meta: string | null): Record<string, string | boolean> => {
  let metaData: Record<string, string | boolean> = {};
  try {
    if (meta) {
      const [metaItem] = /mdx:(.[\w|:]+)/i.exec(meta) || [];
      const [_, field, val] = (metaItem || '').split(':').map((item) => item.trim());
      metaData[field] = val || true;
    }
  } catch (err) {
    console.warn(err);
  }
  return metaData;
};

/** 获取需要渲染的代码块 **/
const getCodeBlock = (child: MarkDownTreeType['children'], opts: Options = {}) => {
  const { lang = ['jsx', 'tsx'] } = opts;
  // 获取渲染部分
  const codeBlock: Record<string | number, CodeBlockItemType> = {};
  try {
    child.forEach((item) => {
      if (item && item.type === 'code' && lang.includes(item.lang)) {
        const line = item.position.start.line;
        const metaData = getMeta(item.meta);
        if (metaData.preview) {
          let name = typeof metaData.preview === 'string' ? metaData.preview : line;
          const funName = `BaseCode${line}`;
          const returnCode = getTransformValue(item.value, `${funName}.${lang}`, funName, opts);
          codeBlock[line] = {
            code: returnCode,
            name,
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

const createStr = (codeBlock: Record<string | number, CodeBlockItemType>) => {
  let baseCodeStr = ``;
  let baseCodeObjStr = ``;
  let codeBlockValue = ``;
  let languageStr = ``;

  try {
    Object.entries(codeBlock).forEach(([key, item]) => {
      const { code, value, language, name } = item;
      baseCodeStr += `${code};\n`;
      baseCodeObjStr += `${name}:BaseCode${key},\n`;
      codeBlockValue += `${name}:${JSON.stringify(value)},\n`;
      languageStr += `${name}:\`${language}\`,\n`;
    });
  } catch (err) {
    console.warn(err);
  }

  let indexStr = `${baseCodeStr} const languages={${languageStr}};\n const codeBlock={${codeBlockValue}};\n const components={${baseCodeObjStr}}`;
  return indexStr;
};

export const getCodeBlockString = (scope: string, opts: Options = {}) => {
  const children = getProcessor(scope);
  const codeBlock = getCodeBlock(children, opts);
  const result = createStr(codeBlock);
  return result;
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
