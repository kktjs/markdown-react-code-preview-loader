/*
 * @Description: markdown 转化
 */
import { MarkDownTreeType, CodeBlockItemType, DepsType, DepNamespacesType } from './interface';
import { transformCode } from './transform';
import webpack from 'webpack';
export * from './interface';
export * from './transform';
import remark from 'remark';
import getCacheIdentifier from 'react-dev-utils/getCacheIdentifier';

/** 转换 代码*/
export const getProcessor = (scope: string) => {
  const child = remark.parse(scope) as MarkDownTreeType;
  return child.children;
};

/** 获取需要渲染的代码块 **/
export const getCodeBlock = (child: MarkDownTreeType['children'], lang: string[] = ['jsx', 'tsx']) => {
  // 获取渲染部分
  const codeBlock: Record<string | number, CodeBlockItemType> = {};
  child.forEach((item) => {
    if (item && item.type === 'code' && lang.includes(item.lang)) {
      const line = item.position.start.line;
      if (/export default/.test(item.value)) {
        const result = transformCode(item.value, `BaseCode${line}`);
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

export const createDepsStr = (
  deps: DepsType[],
  depNamespaces: DepNamespacesType[],
  depDirects: DepNamespacesType[],
) => {
  let defaultStr = ``;
  let asStr = ``;
  let otherStr = ``;
  let directStr = ``;
  // 为了记录是否已经创建过了
  const defaultMap = new Map<string, string>([]);
  const asMap = new Map<string, string>([]);
  const otherMap = new Map<string, string[]>([]);
  const directMap = new Map<string, string>([]);

  /**
   * 1. 先创建 default 的字符串
   * 2. 再创建 as 方式的字符串
   * 3. 再创建 other 的字符串
   * **/
  deps.forEach((rowItem) => {
    Object.entries(rowItem).forEach(([key, itemValue]) => {
      const { default: defaultValue, other } = itemValue;
      if (defaultValue && !defaultMap.has(key)) {
        defaultMap.set(key, defaultValue);
        defaultStr += `import ${defaultValue} from "${key}";\n`;
      }
      if (other && Array.isArray(other)) {
        const oldOtherArr = otherMap.get(key) || [];
        let childStr = ``;
        other.forEach((str) => {
          const findx = oldOtherArr.findIndex((it) => it === str);
          if (findx === -1) {
            childStr += `${str},`;
            oldOtherArr.push(str);
          }
        });
        if (childStr) {
          otherStr += `import { ${childStr} } from "${key}";\n`;
        }
        otherMap.set(key, oldOtherArr);
      }
    });
  });

  depDirects.forEach((rowItem) => {
    Object.entries(rowItem).forEach(([key, value]) => {
      if (!directMap.has(key)) {
        directStr += `import "${key}";\n`;
        directMap.set(key, value);
      }
    });
  });

  depNamespaces.forEach((rowItem) => {
    Object.entries(rowItem).forEach(([key, value]) => {
      if (!asMap.has(key)) {
        asStr += `import ${value} from "${key}";\n`;
        asMap.set(key, value);
      }
    });
  });

  // 判断是否存在 React 依赖
  if (!defaultMap.has('react')) {
    defaultStr += `import React from "react";\n`;
  }

  return `
  ${defaultStr}  
  ${asStr}  
  ${otherStr}
  ${directStr}
  `;
};

const createStr = (codeBlock: Record<string | number, CodeBlockItemType>) => {
  const depsArr: DepsType[] = [];
  const depDirectsArr: DepNamespacesType[] = [];
  const depNamespacesArr: DepNamespacesType[] = [];
  let baseCodeStr = ``;
  let baseCodeObjStr = ``;
  let codeBlockValue = ``;
  let languageStr = ``;
  Object.entries(codeBlock).forEach(([key, item]) => {
    const { code, depNamespaces, deps, depDirects, value, language } = item;
    baseCodeStr += `${code};\n`;
    baseCodeObjStr += `${key}:BaseCode${key},\n`;
    codeBlockValue += `${key}:\`${value}\`,\n`;
    languageStr += `${key}:\`${language}\`,\n`;
    depsArr.push(deps);
    depNamespacesArr.push(depNamespaces);
    depDirectsArr.push(depDirects);
  });
  const depsStr = createDepsStr(depsArr, depNamespacesArr, depDirectsArr);
  let indexStr = `${depsStr} ${baseCodeStr} const languageData={${languageStr}};\n const codeBlockValue={${codeBlockValue}};\n const BaseCodeData={${baseCodeObjStr}}`;
  return indexStr;
};

export const getCodeBlockString = (scope: string, lang: string[] = ['jsx', 'tsx']) => {
  const children = getProcessor(scope);
  const codeBlock = getCodeBlock(children, lang);
  const result = createStr(codeBlock);
  return result;
};

/** 判断是否引入 react/jsx-runtime **/
const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

/**
 * 配置react代码的babel-loader
 * 直接搬 create-react-app 内的配置 (https://github.com/facebook/create-react-app/blob/f99167c014a728ec856bda14f87181d90b050813/packages/react-scripts/config/webpack.config.js#L416-L465)
 */
const getModulesBabelLoader = () => {
  const webpackEnv = process.env.NODE_ENV;
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  return {
    loader: require.resolve('babel-loader'),
    options: {
      customize: require.resolve('babel-preset-react-app/webpack-overrides'),
      presets: [
        [
          require.resolve('babel-preset-react-app'),
          {
            runtime: hasJsxRuntime ? 'automatic' : 'classic',
          },
        ],
      ],
      // @remove-on-eject-begin
      babelrc: false,
      configFile: false,
      // Make sure we have a unique cache identifier, erring on the
      // side of caution.
      // We remove this when the user ejects because the default
      // is sane and uses Babel options. Instead of options, we use
      // the react-scripts and babel-preset-react-app versions.
      cacheIdentifier: getCacheIdentifier(isEnvProduction ? 'production' : isEnvDevelopment && 'development', [
        'babel-plugin-named-asset-import',
        'babel-preset-react-app',
        'react-dev-utils',
        'react-scripts',
      ]),
      // // @remove-on-eject-end
      // plugins: [
      //   isEnvDevelopment &&
      //   shouldUseReactRefresh &&
      //   require.resolve('react-refresh/babel'),
      // ].filter(Boolean),
      // This is a feature of `babel-loader` for webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
      // See #6846 for context on why cacheCompression is disabled
      cacheCompression: false,
      compact: isEnvProduction,
    },
  };
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
            getModulesBabelLoader(),
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
