import { Terminal } from '@xterm/xterm';
import { useEffect, useRef } from 'react';
import "@xterm/xterm/css/xterm.css";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  transports: ['websocket'],
});

export default function TerminalUi({ roomId = "default-room" }) {
  const terminalRef = useRef(null);
  const isRendered = useRef(false);
  const termRef = useRef(null);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;

    const term = new Terminal({
      cursorBlink: true,
      rows: 24,
      fontSize: 14,
    });

    termRef.current = term;
    term.open(terminalRef.current);
    term.writeln("Welcome to codeNimbus");
    term.writeln("Connecting to server...\r\n");

   

    // Receive output from backend pty
    socket.on("terminal-output", (data) => {
      term.write(data);
    });

    // Send user input to backend
    term.onData((data) => {
      socket.emit("terminal-input", data);
    });

   

    return () => {
      socket.disconnect();
  
    };
  }, [roomId]);

  return (
    <div
      id="terminal"
      ref={terminalRef}
      style={{ width: "100%", height: "500px", backgroundColor: "black" }}
    />
  );
}
