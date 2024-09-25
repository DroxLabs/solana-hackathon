"use client";

import React, { useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import BorderWrapper from "../ui/button/border-wrapper";
// import { javascript } from "@codemirror/lang-javascript";

const CodeMirrorEditor: React.FC = () => {
  const [value, setValue] = React.useState("");
  const onChange = React.useCallback((val: string, viewUpdate: any) => {
    console.log("val:", val);
    setValue(val);
  }, []);
  return (
    <BorderWrapper>
      <CodeMirror
        // value={value}
        height="200px"
        className="text-xl w-full"
        theme="dark"
        onChange={onChange}
      />
    </BorderWrapper>
  );
};

export default CodeMirrorEditor;
