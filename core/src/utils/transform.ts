import { transform } from '@babel/standalone';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { DepsType, DepNamespacesType } from './interface';

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
export const transformCode = (content: string, funName: string) => {
  const ast = getAst(content);
  if (!ast) {
    return {
      isDefault: false,
    };
  }
  const deps: DepsType = {};
  const depNamespaces: DepNamespacesType = {};
  const depDirects: DepNamespacesType = {};
  const depArrs: Map<string, string> = new Map([]);
  let isDefault = false;
  const getNameOrValue = (node: t.Identifier | t.StringLiteral) => {
    if (t.isIdentifier(node)) {
      return node.name;
    } else if (t.isStringLiteral(node)) {
      return node.value;
    }
    return node;
  };
  let returnCode = ``;
  /**
   * 1. 获取 import 依赖项
   * 2. 删除 import
   * 3. 对 export default 进行替换 return 返回
   *
   * */
  traverse(ast, {
    /** 解析 import  **/
    ImportDeclaration: (path) => {
      const node = path.node;
      if (node.specifiers && Array.isArray(node.specifiers)) {
        const keys = node.source.value;
        if (node.specifiers.length) {
          depArrs.set(keys, keys);
          deps[keys] = { default: undefined, other: [] };
          node.specifiers.forEach((item) => {
            if (t.isImportDefaultSpecifier(item)) {
              deps[keys].default = getNameOrValue(item.local);
            } else if (t.isImportNamespaceSpecifier(item)) {
              depNamespaces[keys] = getNameOrValue(item.local);
            } else if (t.isImportSpecifier(item)) {
              const imported = getNameOrValue(item.imported);
              const local = getNameOrValue(item.local);
              if (imported === local) {
                deps[keys].other.push(imported);
              } else {
                deps[keys].other.push(`${imported} as ${local}`);
              }
            }
          });
        } else {
          depDirects[keys] = keys;
        }
      }
      // 移除
      path.remove();
    },
    ExportDefaultDeclaration: (path) => {
      isDefault = true;
    },
  });
  const code = generate(ast, {}, content).code;
  const newCode = code.replace('export default', `const Component${funName} =`);
  returnCode = `
    const ${funName} = ()=>{
      ${newCode}
      return <Component${funName}/>
    }
    `;

  return {
    /** 转换好的 function 方法 **/
    code: returnCode,
    /** 默认导入和{} 中间的值 **/
    deps,
    /**  通过 * as DOM 的方式导入  **/
    depNamespaces,
    /** 直接import 'demo' 导入  ***/
    depDirects,
    isDefault,
  };
};
