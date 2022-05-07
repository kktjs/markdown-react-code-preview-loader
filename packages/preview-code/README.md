# 代码案例展示

```bash
 npm i code-layout
```

简化代码块布局和第三方预览工具控制

## 类型参数

```ts
import React from 'react';
import { CodePenOption } from '@uiw/react-codepen';
import { CodeSandboxProps } from '@uiw/react-codesandbox';
import { StackBlitzProps } from '@uiw/react-stackblitz';

export interface CodeProps {
  /** 原始 代码块 渲染**/
  code?: React.ReactNode;
  /** 代码块字符串 **/
  copyNodes?: string;
  /** codePen参数 **/
  codePenOptions?: CodePenOption & {
    includeModule?: string[];
  };
  language?: string;
  /** codeSandbox参数 **/
  codeSandboxOptions?: CodeSandboxProps;
  /** stackBlitz参数 **/
  stackBlitzOptions?: StackBlitzProps;
}

export interface PreviewProps extends CodeProps {
  previewBodyClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

```

## 实例

```tsx
import Preview from "code-layout";
export default () => {
  return (
    <Preview
      copyNodes={`export default ()=>{return <div>3333</div>}`}
      code={<div>展开隐藏部分的代码展示</div>}
    >
      预览效果
    </Preview>
  );
};
```
