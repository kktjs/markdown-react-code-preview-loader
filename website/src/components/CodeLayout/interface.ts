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
