md-loader
===========

解析 markdown 预览代码块，转换成可预览的内容

```bash
 npm i md-loader
```

> 返回值：
>
> 1. source: `markdown`文件字符串
> 2. BaseCodeData: 行对应的可渲染的内容
> 3. codeBlockValue: 行对应的原代码块字符串
> 4. languageData: 行对应的代码块语言
>

```ts
export type MdLoaderReturn = {
  source: string;
  BaseCodeData: Record<string | number, React.FC>
  codeBlockValue: Record<string | number, string>
  languageData: Record<string | number, string>
}
```

## getCodeBlockString 

传递`markdown`文件内容字符串,返回转换好的需要预览的代码块解析数据

## mdCodeModulesLoader

在`webpack`配置中添加`md-loader`的`loader`配置

## kkt中用法

在[kkt](https://github.com/kktjs/kkt)中使用方式

**第一种使用mdCodeModulesLoader方法**

```ts
// .kktrc.ts

import webpack, { Configuration } from 'webpack';
import scopePluginOptions from '@kkt/scope-plugin-options';
import { LoaderConfOptions } from 'kkt';
import { mdCodeModulesLoader } from 'md-loader';

export default (conf: Configuration, env: 'development' | 'production', options: LoaderConfOptions) => {
  // ....
  conf = mdCodeModulesLoader(conf);
  // ....
  return conf;
};

```

**第二种直接自己添加**

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
              loader: 'md-loader',
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

## options参数

> lang: 需要解析代码块的语言,默认:`["jsx","tsx"]`
