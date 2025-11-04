
import Editor from '@monaco-editor/react';
import { useRef, useState } from 'react'
import Terminal from "../components/terminal.jsx"

export default function CodingPlayGround() {
  const editorRef = useRef(null);
  const [code, setCode] = useState("");

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }




  return (
    <>
      <div className='flex overflow-hidden'>
        <Editor
          height="100vh"
          width="50%"
          defaultLanguage="javascript"
          defaultValue="// You can code here"
          onMount={handleEditorDidMount}
          theme='vs-dark'
          onChange={(value) => setCode(value || "")}
          value={code}
        />

        <div className='flex flex-col w-[50%]'>
          <Terminal />
          <div>AI FOR SUGGESTIONS </div>

        </div>
      </div>

    </>
  )
}
