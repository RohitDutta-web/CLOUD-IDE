
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
       
      <div className='flex w-full max-w-screen'>
        <div id='files' className='w-[16%]'>
          

        </div>
         <Editor
          height="70vh"
          width="84%"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
      />
      </div>
      <Terminal/>
    
    </>
  )
}
