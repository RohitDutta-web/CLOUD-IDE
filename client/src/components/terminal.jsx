import { Terminal } from '@xterm/xterm';
import { useEffect, useRef } from 'react';
import "@xterm/xterm/css/xterm.css";

export default function TerminalUi() {

  const terminalRef = useRef(null);
  const isRendered = useRef(false);



  useEffect(() => {

    if (isRendered.current) return;
    isRendered.current = true;
    const term = new Terminal({
      cursorBlink: false,
      rows: 20
    })


    if (terminalRef.current) {
      term.open(terminalRef.current);
      term.writeln("Welcome to codeNimbus");
      term.onData((data) => {
        term.write(data)
      })
    }
  }, [])
  return (
    <div id='terminal' ref={terminalRef}>

    </div>
  )
}
