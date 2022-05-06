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

export type CodeBlockItemType = {
  /** 移出import引用，拼接用于渲染部分的代码 **/
  code?: string;
  /** 原始代码块 **/
  value?: string;
  /** 语言 **/
  language?: string;
};
