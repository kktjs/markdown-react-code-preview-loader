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

- lang: Language to parse code blocks, default: `["jsx","tsx"]`

## Used in the project

After adding `loader`, use the method to load `markdown` text in the project project:

```jsx
import mdObj from 'markdown-react-code-preview-loader/README.md';

mdObj.source       // => `README.md` raw string text
mdObj.components   // => The component index object, the React component converted from the markdown indexed example. (need to configure meta)
mdObj.codeBlock    // => The component source code index object, the sample source code indexed from markdown. (need to configure meta)
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

Pass the `markdown` file content string, and return the converted code block parsing data that needs to be previewed.

## Configure meta ID

Note: You need to add a special `meta` identifier to the code block example, and `loader` will index the `react` example for code conversion.

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

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/kktjs/markdown-react-code-preview-loader/graphs/contributors">
  <img src="https://kktjs.github.io/markdown-react-code-preview-loader/CONTRIBUTORS.svg" />
</a>

Made with [action-contributors](https://github.com/jaywcjlove/github-action-contributors).

### License

Licensed under the MIT License.