export type StartAndEndType = {
  column: number;
  offset: number;
  line: number;
};

export type PositionType = {
  start: StartAndEndType;
  end: StartAndEndType;
};

export type MarkDownTreeType = {
  children: {
    lang: string;
    meta?: any;
    type: string;
    value: string;
    position: PositionType;
    children?: MarkDownTreeType['children'];
  }[];
  position: PositionType;
  type: string;
};

/** 依赖 **/
export type DepsType = Record<
  string,
  {
    /** 默认导出名，例如：`import React from "react"` **/
    default: string;
    /** 其他的导出 ，例如：`import { useState,useEffect } from "react"` **/
    other: string[];
  }
>;
/** 默认导出 别名依赖 **/
export type DepNamespacesType = Record<string, string>;

export type CodeBlockItemType = {
  /** 移出import引用，拼接用于渲染部分的代码 **/
  code?: string;
  /** 依赖 **/
  deps?: DepsType;
  /** 默认导出名 通过 as 别名 ，例如：`import * as Dos "react"` **/
  depNamespaces?: DepNamespacesType;
  /** 其他直接导入的依赖  ，例如：`import "./a.css"` **/
  depDirects?: DepNamespacesType;
};
