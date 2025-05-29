import React, { useEffect, useRef, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

export default function Room() {
  const [code, setCode] = useState(
    `function add(a, b) {\n  return a + b;\n}`
  );

  const [language, setLanguage] = useState("js")
  return (
    <>
      <div className='w-full max-w-screen h-screen bg-zinc-800'>
        <div className='w-full h-2/3 bg-zinc-700'>
          <CodeEditor
            value={code}
            language={language}
            data-color-mode="dark"
            placeholder="Please write code."
            onChange={(evn) => setCode(evn.target.value)}
            padding={15}
            style={{
              backgroundColor: "transparent",
              paddingTop: 20,
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
          />

        </div>
        <div id='terminal'></div>

      </div>

      <select className='absolute'>
        <option value="js">JavaScript</option>
        <option value="c">C</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="php">PHP</option>
        <option value="ruby">Ruby</option>
        <option value="sql">SQL</option>
      </select>
    </>
  )
}
