import React from 'react';
import Code from './code';
import { PreviewProps } from './interface';
import './styles/index.css';
export * from './interface';
const Preview = (props: PreviewProps) => {
  const {
    prefixCls = 'w-code-layout',
    code,
    className = '',
    copyNodes = '',
    codePenOptions,
    codeSandboxOptions,
    stackBlitzOptions,
    previewBodyClassName,
    language = 'jsx',
    customButton,
    bordered = true,
    noCode = false,
    codePadding = 0,
    ...rest
  } = props;
  return (
    <div className={`${prefixCls} ${prefixCls}-body-${bordered} ${className}`}>
      <div {...rest} className={`preview preview-body-${bordered} ${previewBodyClassName}`} />
      {!noCode && (
        <Code
          codePadding={codePadding}
          customButton={customButton}
          language={language}
          codePenOptions={codePenOptions}
          codeSandboxOptions={codeSandboxOptions}
          stackBlitzOptions={stackBlitzOptions}
          code={code}
          copyNodes={copyNodes}
        />
      )}
    </div>
  );
};
export default Preview;
