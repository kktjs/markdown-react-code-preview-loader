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
  const code = `${babelTransform(tran, `${filename}`).code}`
    .replace(`Object.defineProperty(exports, \"__esModule\", {\n  value: true\n});`, '')
    .replace(`exports["default"] = void 0;`, '')
    .replace(`exports["default"] = _default;`, `return _react["default"].createElement(_default)`);

  return `function ${funName}(){
    ${code}
  }`;
};
