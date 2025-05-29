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
            className='h-full'
            value={code}
            language={language}
            data-color-mode="dark"
            placeholder="Please write code."
            onChange={(evn) => setCode(evn.target.value)}
            padding={15}
            style={{
              backgroundColor: "#0000",
              position: "relative",
              top: 50,
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
          />

        </div>
        <div id='terminal'></div>

      </div>

      <select onSelect={(event) => setLanguage(event.target.value)} className="absolute top-2 left-2 text-white cursor-pointer outline-2 p-2 rounded-xl" >
        <option className='bg-zinc-700  cursor-pointer' value="js">JavaScript</option>
        <option className='bg-zinc-700  cursor-pointer' value="c">C</option>
        <option className='bg-zinc-700  cursor-pointer' value="java">Java</option>
        <option className='bg-zinc-700  cursor-pointer' value="python">Python</option>
        <option className='bg-zinc-700  cursor-pointer' value="go">Go</option>
        <option className='bg-zinc-700  cursor-pointer' value="rust">Rust</option>
        <option className='bg-zinc-700  cursor-pointer' value="php">PHP</option>
        <option className='bg-zinc-700  cursor-pointer' value="ruby">Ruby</option>
        <option className='bg-zinc-700  cursor-pointer' value="sql">SQL</option>
      </select>
    </>
  )
}
