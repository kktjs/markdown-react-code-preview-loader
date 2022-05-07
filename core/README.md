md-loader
===========

解析 markdown 预览代码块，转换成可预览的内容

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