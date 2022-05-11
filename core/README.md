markdown-react-code-preview-loader
===

[![CI](https://github.com/kktjs/markdown-react-code-preview-loader/actions/workflows/ci.yml/badge.svg)](https://github.com/kktjs/markdown-react-code-preview-loader/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/markdown-react-code-preview-loader.svg)](https://www.npmjs.com/package/markdown-react-code-preview-loader)
[![npm unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/markdown-react-code-preview-loader/file/README.md)

Index example text in Markdown, converted to React components. The current package is the `loader` of `webpack`, which loads the `markdown` document by configuring the current `loader`, returning a `JS` object containing the `markdown` text, the example index in the `markdown` text.

## Install Loader

```bash
npm i markdown-react-code-preview-loader -D
```

## Configure Loader

After installing the dependency (loader), we need to configure the `loader` into the `webpack` configuration. Learn how to use the configuration `loader` by using two configuration methods in `kkt`.

**① The first method, use the mdCodeModulesLoader method**

`mdCodeModulesLoader` method for adding `markdown-react-code-preview-loader` to webpack config.

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
 * `mdCodeModulesLoader` method for adding `markdown-react-code-preview-loader` to webpack config.
 * @param {webpack.Configuration} config webpack config
 * @param {string[]} lang Parsing language
 * @param {Options} option Loader Options
 * @returns {webpack.Configuration}
 * **/
export declare const mdCodeModulesLoader: (config: webpack.Configuration, lang?: string[], option?: Options) => webpack.Configuration;
```

**② The second method is to manually add the configuration**

The configuration and usage methods are consistent in Webpack.

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

### options parameter

```ts
import { PluginItem } from '@babel/core';
import { Options as RemoveImportsOptions } from 'babel-plugin-transform-remove-imports'
export type Options = {
  /**
   * Language to parse code blocks, default: `["jsx","tsx"]`
   */
  lang?: string[];
  /**
   * Option settings for the babel (babel-plugin-transform-remove-imports) package
   * https://github.com/uiwjs/babel-plugin-transform-remove-imports
   */
  removeImports?: RemoveImportsOptions;
  /**
   * Add babel plugins.
   */
  babelPlugins?: PluginItem[];
}
```

## Used in the project

After adding `loader`, use the method to load `markdown` text in the project project:

```jsx
import mdObj from 'markdown-react-code-preview-loader/README.md';

mdObj.source     // => `README.md` raw string text
mdObj.components // => The component index object, the React component converted from the markdown indexed example. (need to configure meta)
mdObj.data       // => The component source code index object, the sample source code indexed from markdown. (need to configure meta)
```

```js
{
  data: {
    17: {
      code: "\"use strict\";\n\nfunction ......"
      language: "jsx"
      name: 17,
      value: "impo....."
    },
    77: {
      code: "\"use strict\";\n\nfunction ......"
      language: "jsx"
      name: 17,
      value: "impo....."
    },
    demo12: {
      code: "\"use strict\";\n\nfunction ......"
      language: "jsx"
      name: 17,
      value: "impo....."
    }
  },
  components: { 17: ƒ, 77: ƒ, demo12: ƒ },
  source: "# Alert 确认对话框...."
}
```

```ts
export type CodeBlockItem = {
  /** The code after the source code conversion. **/
  code?: string;
  /** original code block **/
  value?: string;
  /** code block programming language **/
  language?: string;
  /** The index name, which can be customized, can be a row number. */
  name?: string | number;
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

## Configure meta ID

Note ⚠️: You need to add a special `meta` identifier to the code block example, and `loader` will index the `react` example for code conversion.

1. `mdx:` special identifier prefix
2. `mdx:preview` Controls whether to perform example indexing, and obtain the required example object through the corresponding line number.
3. `mdx:preview:demo12` Uniquely identified by `demo12`, accurately obtain the `example code` or `example component object` of the index.

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

## Development

```bash
npm install   # Install dependencies
npm install --workspaces # Install sub packages dependencies

npm run watch
npm run start
```

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/kktjs/markdown-react-code-preview-loader/graphs/contributors">
  <img src="https://kktjs.github.io/markdown-react-code-preview-loader/CONTRIBUTORS.svg" />
</a>

Made with [action-contributors](https://github.com/jaywcjlove/github-action-contributors).

### License

Licensed under the MIT License.