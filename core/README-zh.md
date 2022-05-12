markdown-react-code-preview-loader
===

[![CI](https://github.com/kktjs/markdown-react-code-preview-loader/actions/workflows/ci.yml/badge.svg)](https://github.com/kktjs/markdown-react-code-preview-loader/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/markdown-react-code-preview-loader.svg)](https://www.npmjs.com/package/markdown-react-code-preview-loader)
[![npm unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/markdown-react-code-preview-loader/file/README.md)

索引 Markdown 中的示例文本，转换为 React 组件。当前包是 `webpack` 的 `loader`，通过配置当前 `loader` 加载 `markdown` 文档，返回一个 `JS` 对象，包含 `markdown` 文本，`markdown` 文本中的示例索引。

## 安装 Loader

```bash
npm i markdown-react-code-preview-loader -D
```

## 配置 Loader

安装依赖(loader)之后，我们需要将 `loader` 配置到 `webpack` 配置中，通过在 `kkt` 中两种配置方法，了解如何使用配置 `loader`。

**第 ① 种方法，使用 mdCodeModulesLoader 方法**

`mdCodeModulesLoader` 用于在 webpack 配置添加 `markdown-react-code-preview-loader` 的方法。

```ts
// .kktrc.ts
import scopePluginOptions from '@kkt/scope-plugin-options';
import { LoaderConfOptions, WebpackConfiguration } from 'kkt';
import { mdCodeModulesLoader } from 'markdown-react-code-preview-loader';

export default (conf: WebpackConfiguration, env: 'development' | 'production', options: LoaderConfOptions) => {
  // ....
  conf = mdCodeModulesLoader(conf);
  // ....
  return conf;
};
```

```ts
import webpack from 'webpack';
import { Options } from 'markdown-react-code-preview-loader';
/**
 * 用于修改 webpack 配置 loader 的方法
 * @param {webpack.Configuration} config webpack 配置
 * @param {string[]} lang 解析语言
 * @param {Options} option Loader Options
 * @returns {webpack.Configuration}
 * **/
export declare const mdCodeModulesLoader: (config: webpack.Configuration, lang?: string[], option?: Options) => webpack.Configuration;
```

**第 ② 种方法，手动添加配置**

在 Webpack 中配置使用方法是一致的。

```ts
// .kktrc.ts
import webpack, { Configuration } from 'webpack';
import scopePluginOptions from '@kkt/scope-plugin-options';
import { LoaderConfOptions } from 'kkt';

export default (conf: Configuration, env: 'development' | 'production', options: LoaderConfOptions) => {
  // ....
  config.module.rules.forEach((ruleItem) => {
    if (typeof ruleItem === 'object') {
      if (ruleItem.oneOf) {
        ruleItem.oneOf.unshift({
          test: /.md$/,
          use: [
            {
              loader: 'markdown-react-code-preview-loader',
              options: { lang:["jsx","tsx"] },
            },
          ],
        });
      }
    }
  });
  // ....
  return conf;
};
```

### options 参数

```ts
import { PluginItem } from '@babel/core';
import { Options as RemoveImportsOptions } from 'babel-plugin-transform-remove-imports'
export type Options = {
  /**
   * 需要解析代码块的语言，默认: `["jsx","tsx"]`
   */
  lang?: string[];
  /**
   * 删除过滤 imports 包；
   * babel (babel-plugin-transform-remove-imports) 包的 option 设置
   * https://github.com/uiwjs/babel-plugin-transform-remove-imports
   */
  removeImports?: RemoveImportsOptions;
  /**
   * 添加 babel 插件。
   */
  babelPlugins?: PluginItem[];
}
```

## 项目中使用

添加 `loader` 之后，在项目工程中加载 `markdown` 文本使用方法：

```jsx
import mdObj from 'markdown-react-code-preview-loader/README.md';

mdObj.source     // => `README.md` 原始字符串文本
mdObj.components // => 组件索引对象，从 markdown 索引到的示例转换成的 React 组件。(可能需要配置 meta)
mdObj.data       // => 组件源码索引对象，从 markdown 索引到的示例源码。(可能需要配置 meta)
```

```js
{
  data: {
    77: {
      code: "\"use strict\";\n\nfunction ......"
      language: "jsx"
      name: 77,
      meta: {},
      value: "impo....."
    },
    demo12: {
      code: "\"use strict\";\n\nfunction ......"
      language: "jsx"
      name: 'demo12',
      meta: {},
      value: "impo....."
    }
  },
  components: { 77: ƒ, demo12: ƒ },
  source: "# Alert 确认对话框...."
}
```

```ts
export type CodeBlockItem = {
  /** 源码转换后的代码。 **/
  code?: string;
  /** 原始代码块 **/
  value?: string;
  /** 代码块编程语言 **/
  language?: string;
  /** 索引名称可以自定义，可以是行号。 */
  name?: string | number;
  /** `meta` 参数被转换为 `object` */
  meta?: Record<string, string>;
};

export type CodeBlockData = {
  source: string;
  components: Record<CodeBlockItem['name'], React.FC>;
  data: Record<CodeBlockItem['name'], CodeBlockItem>;
};
```

## isMeta

```js
import { isMeta } from 'markdown-react-code-preview-loader';

isMeta('mdx:preview')         // => true
isMeta('mdx:preview:demo12')  // => true
isMeta('mdx:preview--demo12') // => false
```

## getMetaId

```js
import { getMetaId } from 'markdown-react-code-preview-loader';

getMetaId('mdx:preview')        // => ''
getMetaId('mdx:preview:demo12') // => 'demo12'
```

## getCodeBlock 

```ts
const getCodeBlock: (child: MarkdownParseData['children'], opts?: Options) => CodeBlockData['data'];
```

## getURLParameters

```js
import { getURLParameters } from 'markdown-react-code-preview-loader';

getURLParameters('name=Adam&surname=Smith')  // => { name: 'Adam', surname: "Smith" }
getURLParameters('mdx:preview:demo12')       // => { }
getURLParameters('mdx:preview:demo12&name=Adam&surname=Smith')  // => { name: 'Adam', surname: "Smith" }
getURLParameters('mdx:preview:demo12&code=true&boreder=0')      // => { code: 'true', boreder: "0" }
```

```markdown
\```tsx mdx:preview:demo12&code=true&boreder=0
import React from "react"
const Demo = ()=>{
  return <div>测试</div>
}

export default Demo
\```
```

```js
{
  data: {
    demo12: {
      code: "\"use strict\";\n\nfunction ......"
      language: "jsx"
      name: 'demo12',
      meta: { code: 'true', boreder: '0' },
      value: "impo....."
    }
  },
  components: { demo12: ƒ },
  source: "# Alert 确认对话框...."
}
```

## 配置 meta 标识

注意 ⚠️：需要在代码块示例中添加特殊的 `meta` 标识，`loader` 才会去索引对于的 `react` 示例，进行代码转换。

1. `mdx:` 特殊标识前缀
2. `mdx:preview` 控制是否进行进行示例索引，通过对应所在行号，获取需要的示例对象。
3. `mdx:preview:demo12` 通过 `demo12` 唯一标识，准确获取索引的 `示例代码` 或 `示例组件对象`。
4. `mdx:preview:&code=true&border=0` 传递参数，提供给渲染层使用。

```markdown
\```tsx mdx:preview
import React from "react"
const Demo = ()=>{
  return <div>测试</div>
}

export default Demo
\```
```

```markdown
\```tsx mdx:preview:demo12
import React from "react"
const Demo = ()=>{
  return <div>测试</div>
}

export default Demo
\```
```

```markdown
\```tsx mdx:preview:demo12&code=true&boreder=0
import React from "react"
const Demo = ()=>{
  return <div>测试</div>
}

export default Demo
\```
```

## 开发

```bash
npm install   # Install dependencies
npm install --workspaces # Install sub packages dependencies

npm run watch
npm run start
```

## 贡献者

一如既往，感谢我们出色的贡献者！

<a href="https://github.com/kktjs/markdown-react-code-preview-loader/graphs/contributors">
  <img src="https://kktjs.github.io/markdown-react-code-preview-loader/CONTRIBUTORS.svg" />
</a>

由 [action-contributors](https://github.com/jaywcjlove/github-action-contributors) 生成。

### License

Licensed under the MIT License.