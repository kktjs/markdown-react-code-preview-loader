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
