
import Editor from '@monaco-editor/react';
import { useRef, useState } from 'react'
import Terminal from "../components/terminal.jsx"
import { useParams } from "react-router-dom"
import Button from '../components/aiButton.jsx';


export default function CodingPlayGround() {
  const editorRef = useRef(null);
  const [code, setCode] = useState("");
  const { codingLanguage } = useParams();

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }




  return (
    <>
      <div className='flex overflow-hidden'>
        <Editor
          height="100vh"
          width="50%"
          defaultLanguage={codingLanguage}
          defaultValue="// You can code here"
          onMount={handleEditorDidMount}
          theme='vs-dark'
          onChange={(value) => setCode(value || "")}
          value={code}
        />

        <div className='flex flex-col w-[50%]'>
          <Terminal />
          <div className='text-white flex flex-col items-center justify-center h-[50%] border-2 m-2 border-zinc-400 rounded'>
            <div className='flex flex-col items-center gap-2 font-bold'>
             Let ai check your code and suggest improvements
              <Button/>
            </div>
             </div>

        </div>
      </div>

    </>
  )
}
