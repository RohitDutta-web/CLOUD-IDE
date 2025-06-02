import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const XTerminal = () => {
  const terminalRef = useRef(null);
  const terminal = useRef(null);
useEffect(() => {
  if (terminalRef.current && !terminal.current) {
    terminal.current = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff'
      }
    });

   
    setTimeout(() => {
      if (!terminalRef.current) return;

      terminal.current.open(terminalRef.current);
      terminal.current.focus();
      terminal.current.writeln('Welcome to Xterm.js in React');
      terminal.current.onData((data) => terminal.current.write(data));
    }, 0);
  }

  return () => {
    terminal.current?.dispose();
  };
}, []);


  return (
    <div
      ref={terminalRef}
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#1e1e1e',
        outline: 'none'
      }}
      tabIndex="0"
    />
  );
};

export default XTerminal;
