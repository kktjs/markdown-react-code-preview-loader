import React from 'react';
import Code from './code';
import { PreviewProps } from './interface';
export * from './interface';

import './styles/index.css';
const Preview = (props: PreviewProps) => {
  const {
    code,
    className = '',
    copyNodes = '',
    codePenOptions,
    codeSandboxOptions,
    stackBlitzOptions,
    previewBodyClassName,
    language = 'jsx',
    ...rest
  } = props;
  return (
    <div className={`preview-fieldset preview-fieldset-warp ${className}`}>
      <div {...rest} className={`preview-body ${previewBodyClassName}`} />
      <Code
        language={language}
        codePenOptions={codePenOptions}
        codeSandboxOptions={codeSandboxOptions}
        stackBlitzOptions={stackBlitzOptions}
        code={code}
        copyNodes={copyNodes}
      />
    </div>
  );
};
export default Preview;
