import React, { useEffect, useRef, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

export default function Room() {
  const [code, setCode] = useState(
    `function add(a, b) {\n  return a + b;\n}`
  );

  const handleCodeLan = (e) => {
  const selectedLang = e.target.value;
  setLanguage(selectedLang);

  switch (selectedLang) {
    case "js":
      setCode(`function add(a, b) {\n  return a + b;\n}`);
      break;
    case "c":
      setCode(`int add(int a, int b) {\n  return a + b;\n}`);
      break;
    case "java":
      setCode(`public class Main {\n  public static int add(int a, int b) {\n    return a + b;\n  }\n}`);
      break;
    case "python":
      setCode(`def add(a, b):\n    return a + b`);
      break;
    case "go":
      setCode(`func add(a int, b int) int {\n  return a + b\n}`);
      break;
    case "rust":
      setCode(`fn add(a: i32, b: i32) -> i32 {\n    a + b\n}`);
      break;
    case "php":
      setCode(`function add($a, $b) {\n  return $a + $b;\n}`);
      break;
    case "ruby":
      setCode(`def add(a, b)\n  a + b\nend`);
      break;
    case "sql":
      setCode(`CREATE FUNCTION add(a INT, b INT)\nRETURNS INT\nDETERMINISTIC\nRETURN a + b;`);
      break;
  }


    
  }
  const [language, setLanguage] = useState("js")
  return (
    <>
      <div className='w-full max-w-screen h-screen bg-zinc-800'>
        <div className='w-full h-[65%] bg-zinc-900 flex'>
          <CodeEditor
            className='h-[85%] w-[90%]'
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
          <div className='h-full w-[10%] gap-3 bg-zinc-700 flex flex-col items-center pt-2' id='users' >
            <p className='text-white'>1124</p>
            <div className='flex flex-wrap items-center gap-3 justify-center w-full'>
               <div id='userBox' className=' bg-green-800 font-bold text-white pt-2 pb-2 pl-3 rounded pr-3'>
              RD
            </div>
             <div id='userBox' className=' bg-green-800 font-bold text-white pt-2 pb-2 pl-3 rounded pr-3'>
              RD
            </div>
           </div>

          </div>

        </div>
        <div id='terminal'></div>

      </div>

      <select onChange={ (e) => handleCodeLan(e)} className="absolute top-2 left-2 text-white cursor-pointer outline-2 p-2 rounded-xl" >
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
