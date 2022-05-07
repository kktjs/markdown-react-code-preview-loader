/*
 * @Description: markdown 转化
 */
import { MarkDownTreeType, CodeBlockItemType } from './interface';
import { getTransformValue } from './transform';
import webpack from 'webpack';
export * from './interface';
import remark from 'remark';

/** 转换 代码*/
const getProcessor = (scope: string) => {
  const child = remark.parse(scope) as MarkDownTreeType;
  return child.children;
};

const getMate = (meta: string | null): Record<string, string | boolean> => {
  let metaData: Record<string, string | boolean> = {};
  if (meta) {
    meta.split(/\|/).forEach((item) => {
      const value = item.trim();
      if (value) {
        const [field, val] = value.split(':');
        metaData[field] = val || true;
      }
    });
  }
  return metaData;
};

/** 获取需要渲染的代码块 **/
const getCodeBlock = (child: MarkDownTreeType['children'], lang: string[] = ['jsx', 'tsx']) => {
  // 获取渲染部分
  const codeBlock: Record<string | number, CodeBlockItemType> = {};
  child.forEach((item) => {
    if (item && item.type === 'code' && lang.includes(item.lang)) {
      const line = item.position.start.line;
      const metaData = getMate(item.meta);
      if (metaData.preview) {
        const funName = `BaseCode${line}`;
        const returnCode = getTransformValue(item.value, `${funName}.${lang}`, funName);
        codeBlock[line] = {
          code: returnCode,
          name: metaData.name || line,
          language: item.lang,
          value: item.value,
        };
      }
    }
  });
  return codeBlock;
};

const createStr = (codeBlock: Record<string | number, CodeBlockItemType>) => {
  let baseCodeStr = ``;
  let baseCodeObjStr = ``;
  let codeBlockValue = ``;
  let languageStr = ``;
  Object.entries(codeBlock).forEach(([key, item]) => {
    const { code, value, language, name } = item;
    baseCodeStr += `${code};\n`;
    baseCodeObjStr += `${name}:BaseCode${key},\n`;
    codeBlockValue += `${name}:\`${value}\`,\n`;
    languageStr += `${name}:\`${language}\`,\n`;
  });
  let indexStr = `${baseCodeStr} const languageData={${languageStr}};\n const codeBlockValue={${codeBlockValue}};\n const BaseCodeData={${baseCodeObjStr}}`;
  return indexStr;
};

export const getCodeBlockString = (scope: string, lang: string[] = ['jsx', 'tsx']) => {
  const children = getProcessor(scope);
  const codeBlock = getCodeBlock(children, lang);
  const result = createStr(codeBlock);
  return result;
};

/**
 * 配置好markdown的loader
 * @param {webpack.Configuration} config webpack配置
 * @param {string[]} lang 解析语言
 * @returns {webpack.Configuration}
 * **/
export const mdCodeModulesLoader = (config: webpack.Configuration, lang?: string[]): webpack.Configuration => {
  config.module.rules.forEach((ruleItem) => {
    if (typeof ruleItem === 'object') {
      if (ruleItem.oneOf) {
        ruleItem.oneOf.unshift({
          test: /.md$/,
          use: [
            {
              loader: 'markdown-react-code-preview-loader',
              options: { lang },
            },
          ],
        });
      }
    }
  });
  return config;
};
