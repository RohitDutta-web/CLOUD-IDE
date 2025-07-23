import { useState } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { IoMdChatboxes, IoMdSend } from "react-icons/io";
import { CiPlay1 } from "react-icons/ci";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
});

export default function Room() {
  const { roomId } = useParams();
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);
  const [fileExtension, setFileExtension] = useState("js");
  const [language, setLanguage] = useState("js");
  const [chatBox, setChatBox] = useState(false);

  const messages = [
    { sender: "Rohit", message: "Hello" },
    { sender: "Jiju", message: "Hello" },
    { sender: "Niya", message: "Hello" },
    { sender: "Baba", message: "Hello" },
    { sender: "Ma", message: "Hello" },
    { sender: "Didi", message: "Hello" },
    { sender: "Bubu", message: "Hello" },
    { sender: "Attoja", message: "Hello" },
  ];

  const handleChatBox = () => setChatBox((prev) => !prev);

  const handleCodeLan = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);

    const codeTemplates = {
      js: [`function add(a, b) {\n  return a + b;\n}`, "js"],
      c: [`int add(int a, int b) {\n  return a + b;\n}`, "c"],
      java: [
        `public class Main {\n  public static int add(int a, int b) {\n    return a + b;\n  }\n}`,
        "java",
      ],
      python: [`def add(a, b):\n    return a + b`, "py"],
      go: [`func add(a int, b int) int {\n  return a + b\n}`, "go"],
      rust: [`fn add(a: i32, b: i32) -> i32 {\n    a + b\n}`, "rs"],
      php: [`function add($a, $b) {\n  return $a + $b;\n}`, "php"],
      ruby: [`def add(a, b)\n  a + b\nend`, "rb"],
      sql: [
        `CREATE FUNCTION add(a INT, b INT)\nRETURNS INT\nDETERMINISTIC\nRETURN a + b;`,
        "sql",
      ],
    };

    const [newCode, extension] = codeTemplates[selectedLang] || ["", ""];
    setCode(newCode);
    setFileExtension(extension);
  };

  return (
    <>
      <div className="w-full h-screen bg-zinc-800">
        <div className="flex h-full bg-zinc-900">
          <CodeEditor
            className="h-[85%] w-[90%]"
            value={code}
            language={language}
            data-color-mode="dark"
            placeholder="Please write code."
            onChange={(e) => setCode(e.target.value)}
            padding={15}
            style={{
              backgroundColor: "transparent",
              position: "relative",
              top: 50,
              fontFamily:
                "ui-monospace,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace",
            }}
          />
          <div className="w-[10%] h-full bg-zinc-700 flex flex-col items-center pt-2 gap-3">
            <p className="text-white">{roomId}</p>
            <div className="flex flex-wrap gap-3 justify-center w-full">
              <div className="bg-green-800 text-white font-bold py-2 px-3 rounded">
                RD
              </div>
            </div>
            <IoMdChatboxes
              className="absolute top-[58%] text-4xl text-zinc-300 hover:text-white cursor-pointer"
              onClick={handleChatBox}
            />
            <Drawer>
              <DrawerTrigger>
                <button className="text-green-400 border border-green-400 px-4 py-2 rounded cursor-pointer">
                  <CiPlay1 />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                  <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose>
                    <button className="text-green-400 border border-green-400 px-4 py-2 rounded cursor-pointer">
                      Close
                    </button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      <select
        onChange={handleCodeLan}
        className="absolute top-2 left-2 text-white bg-zinc-700 p-2 rounded-xl cursor-pointer"
      >
        {Object.keys({
          js: "JavaScript",
          c: "C",
          java: "Java",
          python: "Python",
          go: "Go",
          rust: "Rust",
          php: "PHP",
          ruby: "Ruby",
          sql: "SQL",
        }).map((lang) => (
          <option key={lang} value={lang}>
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </option>
        ))}
      </select>

      {chatBox && (
        <div className="absolute top-[20%] right-[8%] z-40 w-[300px] h-[500px] bg-zinc-200 rounded shadow-2xl flex flex-col">
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="bg-zinc-400 p-2 rounded">
                <p className="font-bold text-sm">{msg.sender}</p>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>
          <div className="bg-zinc-700 flex items-center gap-3 p-2">
            <input
              type="text"
              className="bg-zinc-300 w-[80%] rounded-full p-2"
              placeholder="Type a message..."
            />
            <IoMdSend className="text-2xl text-white cursor-pointer" />
          </div>
        </div>
      )}
    </>
  );
}
