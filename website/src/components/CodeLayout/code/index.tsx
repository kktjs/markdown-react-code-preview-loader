import React from 'react';
import { CodeProps } from '../interface';
import Copy from './Copy';
import ShowHide from './ShowHide';
import Codesandbox from './codesandbox';
import Stackblitz from './stackblitz';
import Codepen from './codepen';
const Code = (props: CodeProps) => {
  const { code, copyNodes, codePenOptions, codeSandboxOptions, stackBlitzOptions, language, codePadding } = props;
  const style = React.useMemo(() => {
    if (typeof codePadding) {
      return { padding: codePadding };
    }
    return {};
  }, [codePadding]);
  const [show, setShow] = React.useState(false);
  return (
    <React.Fragment>
      <div className="preview-button">
        {codeSandboxOptions && <Codesandbox {...codeSandboxOptions} />}
        {codePenOptions && <Codepen {...codePenOptions} />}
        {stackBlitzOptions && <Stackblitz {...stackBlitzOptions} />}
        <Copy copyNodes={copyNodes} />
        <ShowHide show={show} onClick={setShow} />
      </div>
      <div className={`preview-code preview-code-${show}`} style={style}>
        <pre className={`language-${language}`}>{code}</pre>
      </div>
    </React.Fragment>
  );
};

export default Code;
