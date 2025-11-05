
import Editor from '@monaco-editor/react';
import { useRef, useState } from 'react'
import Terminal from "../components/terminal.jsx"
import { useParams } from "react-router-dom"


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
          <div>AI FOR SUGGESTIONS <button >{codingLanguage}</button> </div>

        </div>
      </div>

    </>
  )
}
