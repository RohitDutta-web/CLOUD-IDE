import { Terminal } from '@xterm/xterm';
import { useEffect, useRef } from 'react';
import "@xterm/xterm/css/xterm.css";
import io from "socket.io-client";
import { FitAddon } from '@xterm/addon-fit';
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
      fontSize: 14,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();

    window.addEventListener("resize", () => {
      fitAddon.fit();
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
      window.removeEventListener("resize", fitAddon.fit);

    };
  }, [roomId]);

  return (
    <div
      id="terminal"
      ref={terminalRef}
      style={{
        width: "100%",
        height: "50%",
        backgroundColor: "black",
        padding: "5px",
        overflow: "hidden",
      }}

    ></div>
  );
}
