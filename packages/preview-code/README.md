# 效果渲染

```bash
 npm i md-code-preview
```

## 类型参数

```ts
import React from "react";
import { CodePenOption } from "@uiw/react-codepen";
import { CodeSandboxProps } from "@uiw/react-codesandbox";
import { StackBlitzProps } from "@uiw/react-stackblitz";

export interface RenderProps {
  previewBodyClassName?: string;
  /**
   * 通过 import() 的方式引入组件，可以直接返回一个组件
   * **/
  component?: () =>
    | Promise<{ default: React.ComponentType<any> }>
    | React.ReactNode;
  children?: React.ReactNode;
}

export type CommentsType = {
  /** 标题 **/
  title?: React.ReactNode;
  /** 简介 **/
  description?: React.ReactNode;
  [k: string]: React.ReactNode;
};

export interface CodeProps {
  /** 原始 代码块 渲染**/
  code?: React.ReactNode;
  /** 解析出的 标题和 简介部分 **/
  comments?: CommentsType;
  /** 代码块字符串 **/
  copyNodes?: string;
  /** codePen参数 **/
  codePenOptions?: CodePenOption & {
    includeModule?: string[];
  };
  /** codeSandbox参数 **/
  codeSandboxOptions?: CodeSandboxProps;
  /** stackBlitz参数 **/
  stackBlitzOptions?: StackBlitzProps;
}

export interface PreviewProps extends RenderProps, CodeProps {
  className?: string;
  /** 是否需要代码块下方的边距  */
  isSpacing?: boolean;
  /** 通过 <!--rehype:bgWhite=true&codeSandbox=true&codePen=true--> 传递的参数 **/
  properties?: Record<string, unknown>;
}
```

## 实例

```tsx
import Preview from "md-code-preview";
export default () => {
  return (
    <Preview
      copyNodes={`export default ()=>{return <div>3333</div>}`}
      properties={{}}
      comments={{
        title: <h1>标题</h1>,
        description: <p>简介部分</p>,
      }}
      code={<div>展开隐藏部分的代码展示</div>}
    >
      预览效果
    </Preview>
  );
};
```
