import { transform } from '@babel/standalone';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export function babelTransform(input: string, filename: string) {
  return transform(input, {
    filename,
    presets: ['env', 'es2015', 'react', 'typescript'],
  });
}

export const getTransformValue = (str: string, filename: string, funName: string) => {
  const isReact = /import React.+from ("|')react("|')/.test(str);
  // 先判断 是否引入 react
  const tran = isReact ? str : `import React from "react"\n ${str}`;
  const code = `${babelTransform(tran, `${filename}`).code}`
    .replace(`Object.defineProperty(exports, \"__esModule\", {\n  value: true\n});`, '')
    .replace(`exports["default"] = void 0;`, '')
    .replace(`exports["default"] = _default;`, `return _react["default"].createElement(_default)`);

  return `function ${funName}(){
    ${code}
  }`;
};

export const getAst = (content: string) => {
  try {
    const ast = parse(content, {
      // 在严格模式下解析并允许模块声明
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'functionBind',
        'nullishCoalescingOperator',
        'objectRestSpread',
        'optionalChaining',
        'decorators-legacy',
      ],
    });
    return ast;
  } catch (err) {
    console.log(`不需要渲染效果的代码块中请勿出现"export default"，防止解析代码块出现变量名重复报错。\n`, err);
    process.exit(1);
  }
};

// 引入 babel 插件
// 对代码块进行解析，获取import依赖，删除import ，拼接成一个方法字符串
export const transformCode = (content: string, lang: string, funName: string) => {
  const ast = getAst(content);
  if (!ast) {
    return {
      isDefault: false,
    };
  }
  let isDefault = false;
  let returnCode = ``;
  traverse(ast, {
    ExportDefaultDeclaration: () => {
      isDefault = true;
    },
  });
  returnCode = getTransformValue(content, `${funName}.${lang}`, funName);
  return {
    /** 转换好的 function 方法 **/
    code: returnCode,
    isDefault,
  };
};
