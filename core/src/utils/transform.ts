import { transform } from '@babel/standalone';

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
  /** 先把默认导出 export default 进行替换 **/
  const newCode = `${tran.replace('export default', 'const _default = ')}\n`;
  const code = `${babelTransform(newCode, `${filename}`).code}\n return _react["default"].createElement(_default)`;

  return `function ${funName}(){
    ${code}
  }`;
};
