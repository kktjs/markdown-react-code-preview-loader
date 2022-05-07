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

- lang: 需要解析代码块的语言，默认: `["jsx","tsx"]`

## 项目中使用

添加 `loader` 之后，在项目工程中加载 `markdown` 文本使用方法：

```jsx
import mdObj from 'markdown-react-code-preview-loader/README.md';

mdObj.source       // => `README.md` 原始字符串文本
mdObj.components   // => 组件索引对象，从 markdown 索引到的示例转换成的 React 组件。(需要配置 meta)
mdObj.codeBlock    // => 组件源码索引对象，从 markdown 索引到的示例源码。(需要配置 meta)
```

```js
{
  codeBlock: {
    17: 'import React from ...',
    77: 'import React from ...',
    base23: 'import React from ...'
  },
  components: { 17: ƒ, 77: ƒ, base23: ƒ },
  languages: { 17: 'jsx', 77: 'jsx', base23: 'jsx'},
  source: "# Alert 确认对话框...."
}
```

```ts
export type CodeBlockData = {
  source: string;
  components: Record<string | number, React.FC>;
  codeBlock: Record<string | number, string>;
  languages: Record<string | number, string>;
};
```

## getCodeBlockString 

传递 `markdown` 文件内容字符串，返回转换好的需要预览的代码块解析数据。

## 配置 meta 标识

注意：需要在代码块示例中添加特殊的 `meta` 标识，`loader` 才会去索引对于的 `react` 示例，进行代码转换。

1. `mdx:` 特殊标识前缀
2. `mdx:preview` 控制是否进行进行示例索引，通过对应所在行号，获取需要的示例对象。
3. `mdx:preview:demo12` 通过 `demo12` 唯一标识，准确获取索引的 `示例代码` 或 `示例组件对象`。

```markdown mdx:preview
\```tsx
import React from "react"
const Demo = ()=>{
  return <div>测试</div>
}

export default Demo
\```  

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
npm run hoist # Install sub packages dependencies

npm run watch:loader
npm run start
```
### License

Licensed under the MIT License.