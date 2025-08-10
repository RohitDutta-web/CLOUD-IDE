import Docker from "dockerode";

const docker = new Docker();

const languageDockerConfig = {
  js: {
    image: "node:20-alpine",
    cmd: ["node", "code.js"],
  },
  c: {
    image: "gcc:13.2",
    cmd: ["bash", "-c", "gcc code.c -o code && ./code"],
  },
  java: {
    image: "openjdk:21-slim",
    cmd: ["bash", "-c", "javac Main.java && java Main"],
  },
  python: {
    image: "python:3.12-alpine",
    cmd: ["python", "code.py"],
  },
  go: {
    image: "golang:1.22",
    cmd: ["go", "run", "code.go"],
  },
  rust: {
    image: "rust:1.80",
    cmd: ["bash", "-c", "rustc code.rs && ./code"],
  },
  php: {
    image: "php:8.3-cli",
    cmd: ["php", "code.php"],
  },
  ruby: {
    image: "ruby:3.3-alpine",
    cmd: ["ruby", "code.rb"],
  },
  sql: {
    image: "nouchka/sqlite3:latest",
    cmd: ["sqlite3", ":memory:", ".read code.sql"],
  },
};


export const langContainer = async (language) => {
  const config = languageDockerConfig[language];
  
  const container = await docker.createContainer({
  Image: config.image,
  Cmd:config.cmd,
  Tty: false,
  HostConfig: {
    AutoRemove: true,
    Binds: [`/host/temp/folder:/app`],
  },
  WorkingDir: '/app',
});
await container.start();

}