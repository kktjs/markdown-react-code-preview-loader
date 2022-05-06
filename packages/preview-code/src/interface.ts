import React from 'react';
import { CodePenOption } from '@uiw/react-codepen';
import { CodeSandboxProps } from '@uiw/react-codesandbox';
import { StackBlitzProps } from '@uiw/react-stackblitz';

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
  /** 是否需要代码块下方的边距  */
  isSpacing?: boolean;
  /** 通过 <!--rehype:bgWhite=true&codeSandbox=true&codePen=true--> 传递的参数 **/
  properties?: Record<string, unknown>;
  children?: React.ReactNode;
}
