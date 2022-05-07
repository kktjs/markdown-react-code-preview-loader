/*
 * @Description: markdown 转化
 */
import { MarkDownTreeType, CodeBlockItemType } from './interface';
import { transformCode } from './transform';
import webpack from 'webpack';
export * from './interface';
import remark from 'remark';

/** 转换 代码*/
const getProcessor = (scope: string) => {
  const child = remark.parse(scope) as MarkDownTreeType;
  return child.children;
};

/** 获取需要渲染的代码块 **/
const getCodeBlock = (child: MarkDownTreeType['children'], lang: string[] = ['jsx', 'tsx']) => {
  // 获取渲染部分
  const codeBlock: Record<string | number, CodeBlockItemType> = {};
  child.forEach((item) => {
    if (item && item.type === 'code' && lang.includes(item.lang)) {
      const line = item.position.start.line;
      if (/export default/.test(item.value)) {
        const result = transformCode(item.value, item.lang, `BaseCode${line}`);
        if (result.isDefault) {
          codeBlock[line] = {
            ...result,
            language: item.lang,
            value: item.value,
          };
        }
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
    const { code, value, language } = item;
    baseCodeStr += `${code};\n`;
    baseCodeObjStr += `${key}:BaseCode${key},\n`;
    codeBlockValue += `${key}:\`${value}\`,\n`;
    languageStr += `${key}:\`${language}\`,\n`;
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
              loader: 'md-loader',
              options: { lang },
            },
          ],
        });
      }
    }
  });
  return config;
};
