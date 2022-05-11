import { transform } from '@babel/standalone';
import { PluginItem, PluginObj } from '@babel/core';
import removeImports from 'babel-plugin-transform-remove-imports';
import { Options } from '../';

export function defaultExportReplace(): PluginObj {
  return {
    name: 'transform-replace-export-default-to-return',
    visitor: {
      ExportDefaultDeclaration(path, opts) {
        const declaration = path.node.declaration;
        if (declaration.type === 'ClassDeclaration' || declaration.type === 'FunctionDeclaration') {
          declaration.id.name = `return ${declaration.id.name}`;
        } else if (declaration.type === 'Identifier') {
          declaration.name = `return ${declaration.name}`;
        }
        if (declaration) {
          path.replaceWith(declaration);
        }
      },
    },
  };
}

export const getTransformValue = (str: string, filename: string, opts: Options) => {
  try {
    const plugins: PluginItem[] = [...(opts.babelPlugins || [])];
    if (opts.removeImports) {
      plugins.push([removeImports, opts.removeImports]);
    }
    const result = transform(str, {
      filename,
      presets: ['env', 'es2015', 'react', 'typescript'],
      plugins: [...plugins, defaultExportReplace],
    });
    return result.code;
  } catch (err) {
    console.warn(err);
  }
};
