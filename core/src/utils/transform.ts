import { transform } from '@babel/standalone';
import { PluginItem } from '@babel/core';
import removeImports from 'babel-plugin-transform-remove-imports';
import { Options } from '../';

export function babelTransform(input: string, filename: string, opts: Options = {}) {
  const plugins: PluginItem[] = [...(opts.babelPlugins || [])];
  if (opts.removeImports) {
    plugins.push([removeImports, opts.removeImports]);
  }
  return transform(input, {
    filename,
    presets: ['env', 'es2015', 'react', 'typescript'],
    plugins: [...plugins],
  });
}

export const getTransformValue = (str: string, filename: string, funName: string, opts: Options) => {
  try {
    const isReact = /import\x20+React(\x20+|[\x20+,]+({[a-zA-Z0-9,\s]+}|{})\x20+)from\x20+('|")react('|")/.test(str);
    // 先判断 是否引入 react
    const tran = isReact ? str : `import React from "react"\n ${str}`;
    /** 先把默认导出 export default 进行替换 **/
    const newCode = `${tran.replace(/export\x20+default/, 'const _default = ')}\n`;
    const tranCode = babelTransform(newCode, `${filename}`, opts).code;
    const code = `${tranCode}\n return _react["default"].createElement(_default)`;
    return `function ${funName}(){\n${code}\n};`;
  } catch (err) {
    console.warn(err);
  }
};
