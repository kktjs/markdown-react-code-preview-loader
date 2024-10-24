import { transform } from '@babel/standalone';
import { type PluginItem } from '@babel/core';
import removeImports from 'babel-plugin-transform-remove-imports';
import replaceExportDefault from 'babel-plugin-transform-replace-export-default';
import { type Options } from '../';

export const getTransformValue = (str: string, filename: string, opts: Options) => {
  const plugins: PluginItem[] = [...(opts.babelPlugins || [])];
  if (opts.removeImports) {
    plugins.push([removeImports, opts.removeImports]);
  }
  const result = transform(str, {
    filename,
    presets: ['env', 'es2015', 'react', 'typescript'],
    plugins: [...plugins, replaceExportDefault],
  });
  return result.code;
};
