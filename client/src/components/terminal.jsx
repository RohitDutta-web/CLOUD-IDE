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
  const command = useRef("");

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


    term.onData((data) => {
      if (data == '\r') {
        //need to implement command execution here
        term.write('\r\n');
        command.current = "";
      } else if (data == "\u007F") {
        if (command.current.length > 0) {
          command.current = command.current.slice(0, -1)
          term.write('\b \b');

        }
      } else {
        command.current += data;
        term.write(data);
      }
    })




    return () => {
      socket.disconnect();

    };
  }, [roomId]);

  return (
    <div
      id="terminal"
      ref={terminalRef}
      style={{ width: "50%", height: "100vh", backgroundColor: "black" }}
    />
  );
}
