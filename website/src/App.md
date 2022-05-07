
## Basic 

<!--rehype:bgWhite=true&codeSandbox=true&codePen=true-->

```jsx | preview
import React from "react";
import ReactDOM from "react-dom";
import { Alert, ButtonGroup, Button } from "uiw";

class Demo extends React.Component {
  constructor() {
    super();
    this.state = {
      visible1: false,
      visible2: false,
    };
  }
  onClick(type) {
    this.setState({ [type]: !this.state[type] });
  }
  onClosed(type) {
    this.setState({ [type]: false });
  }
  render() {
    return (
      <div>
        <Alert
          isOpen={this.state.visible1}
          confirmText="确定按钮"
          onClosed={this.onClosed.bind(this, "visible1")}
          content="这个对话框只有两个个按钮，单击“确定按钮”后，此对话框将关闭。用作通知用户重要信息。"
        />
        <Alert
          isOpen={this.state.visible2}
          confirmText="确定按钮"
          cancelText="取消按钮"
          type="danger"
          onConfirm={() => console.log("您点击了确定按钮！")}
          onCancel={() => console.log("您点击了取消按钮！")}
          onClosed={this.onClosed.bind(this, "visible2")}
        >
          这个对话框有两个按钮，单击 “<b>确定按钮</b>” 或 “<b>取消按钮</b>”
          后，此对话框将关闭，触发 “<b>onConfirm</b>” 或 “<b>onCancel</b>”
          事件。用作通知用户重要信息。
        </Alert>
        <ButtonGroup>
          <Button onClick={this.onClick.bind(this, "visible1")}>
            单个按钮确认对话框
          </Button>
          <Button onClick={this.onClick.bind(this, "visible2")}>
            确认对话框
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}
export default Demo;
```
