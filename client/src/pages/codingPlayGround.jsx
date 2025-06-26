
import Editor from '@monaco-editor/react';
import { useRef } from 'react'

export default function CodingPlayGround() {
    const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current.getValue());
  }
  return (
    <>
        <button onClick={showValue}>Show value</button>
      <Editor
        height="80vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
      />
    </>
  )
}
