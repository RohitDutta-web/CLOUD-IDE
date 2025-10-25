
import Editor from '@monaco-editor/react';
import { useRef } from 'react'
import Terminal from "../components/terminal.jsx"

export default function CodingPlayGround() {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }


  return (
    <>
      <div className='flex'>
        <Editor
          height="100vh"
          width="50%"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          onMount={handleEditorDidMount}
          theme='vs-dark'
        />

        <Terminal />
      </div>

    </>
  )
}
