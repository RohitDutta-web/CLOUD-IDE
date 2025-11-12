import Editor from '@monaco-editor/react';
import { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
});


export default function CodingPlayGround() {
  const editorRef = useRef(null);
  const [code, setCode] = useState("");
  const { codingLanguage } = useParams();

  // UI state
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [bugReport, setBugReport] = useState("");
  const [timeoutMs] = useState(15000);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  // socket listeners (mount once)
  useEffect(() => {
    const onStdout = (chunk) => setOutput(prev => prev + chunk);
    const onStderr = (chunk) => setOutput(prev => prev + chunk);
    const onExit = (code) => {
      setRunning(false);
      setOutput(prev => prev + `\n[process exited with code ${code}]\n`);
    };
    const onAi = (payload) => setAiSuggestions(payload?.suggestions ?? payload?.text ?? String(payload));
    const onBug = (payload) => setBugReport(payload?.report ?? JSON.stringify(payload, null, 2));

    socket.on('stdout', onStdout);
    socket.on('stderr', onStderr);
    socket.on('exit', onExit);
    socket.on('aiSuggestions', onAi);
    socket.on('bugReport', onBug);

    return () => {
      socket.off('stdout', onStdout);
      socket.off('stderr', onStderr);
      socket.off('exit', onExit);
      socket.off('aiSuggestions', onAi);
      socket.off('bugReport', onBug);
    };
  }, []);

  // actions
  function runCode() {
    if (!code || !code.trim()) {
      setOutput('No code to run.\n');
      return;
    }
    setOutput('');
    setRunning(true);
    // backend should accept { language, code, timeoutMs }
    socket.emit('runCode', {
      language: codingLanguage || 'javascript',
      code,
      timeoutMs
    });
  }

  function findBugs() {
    if (!code || !code.trim()) {
      setBugReport('No code provided for bug analysis.');
      return;
    }
    setBugReport('Analyzing for bugs...');
    socket.emit('bugFind', {
      language: codingLanguage || 'javascript',
      code
    });
  }

  function askAiReview() {
    if (!code || !code.trim()) {
      setAiSuggestions('No code to review.');
      return;
    }
    setAiSuggestions('Waiting for AI suggestions...');
    socket.emit('aiCheck', {
      language: codingLanguage || 'javascript',
      code,
      hints: { focus: ['correctness', 'performance', 'style', 'security'] }
    });
  }

  function clearAll() {
    setOutput('');
    setAiSuggestions('');
    setBugReport('');
  }

  return (
    <>
      <div className='flex overflow-hidden h-screen'>
        {/* Editor */}
        <div className='w-1/2'>
          <Editor
            height="100vh"
            width="100%"
            defaultLanguage={codingLanguage}
            defaultValue={"// You can code here"}
            onMount={handleEditorDidMount}
            theme='vs-dark'
            onChange={(value) => setCode(value || "")}
            value={code}
          />
        </div>

        {/* Controls + Output */}
        <div className='flex flex-col w-[50%] p-6 gap-4 bg-zinc-900'>
          {/* Header */}
          <div className='flex items-start gap-4'>
            <div>
              <h2 className='text-2xl text-green-300 font-semibold'>Playground</h2>
              <p className='text-sm text-zinc-400'>Run code, find bugs, or get AI suggestions.</p>
            </div>

            <div className='ml-auto flex items-center gap-3'>
              <button
                onClick={runCode}
                disabled={running}
                className={`px-4 py-2 rounded shadow-sm text-sm font-medium ${running ? 'bg-green-600/60 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600' } text-white`}
              >
                {running ? 'Running...' : 'Run'}
              </button>

              <button
                onClick={findBugs}
                className='px-4 py-2 rounded border text-sm bg-zinc-800 text-white hover:bg-zinc-700'
              >
                Bug Findings
              </button>

              <button
                onClick={askAiReview}
                className='px-4 py-2 rounded border text-sm bg-indigo-600 hover:bg-indigo-700 text-white'
              >
                AI Review
              </button>

              <button
                onClick={clearAll}
                className='px-3 py-2 rounded border text-sm bg-transparent text-zinc-300 hover:bg-zinc-800'
              >
                Clear
              </button>
            </div>
          </div>

          {/* Output panel */}
          <div className='flex-1 grid grid-cols-2 gap-4'>
            <div className='col-span-2 lg:col-span-1 flex flex-col border rounded bg-black/90 p-3'>
              <div className='flex items-center justify-between mb-2'>
                <div className='text-xs text-zinc-400'>Output</div>
                <div className='text-xs text-zinc-500'>Streaming results (stdout / stderr)</div>
              </div>
              <div className='flex-1 overflow-auto'>
                <pre className='text-sm text-white whitespace-pre-wrap'>{output || 'Output will appear here when you run the code.'}</pre>
              </div>
            </div>

            {/* Bug findings */}
            <div className='col-span-2 lg:col-span-1 flex flex-col border rounded bg-zinc-800 p-3'>
              <div className='text-xs text-zinc-400 mb-2'>Bug Findings</div>
              <div className='flex-1 overflow-auto'>
                <pre className='text-sm text-amber-200 whitespace-pre-wrap'>{bugReport || 'Click "Bug Findings" to detect common issues and potential bugs.'}</pre>
              </div>
            </div>

            {/* AI suggestions */}
            <div className='col-span-2 flex flex-col border rounded bg-zinc-800 p-3'>
              <div className='flex items-center justify-between mb-2'>
                <div className='text-xs text-zinc-400'>AI Suggestions</div>
                <div className='text-xs text-zinc-500'>Style, performance, security tips</div>
              </div>
              <div className='flex-1 overflow-auto'>
                <pre className='text-sm text-sky-200 whitespace-pre-wrap'>{aiSuggestions || 'Click "AI Review" to get suggestions.'}</pre>
              </div>
            </div>
          </div>

          {/* Bottom / AI button area */}
     
        </div>
      </div>
    </>
  )
}
