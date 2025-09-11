// language configuration details for Dockerode containers
export const languageDockerConfig = {
  js: {
    image: "node:20-alpine",
    cmd: (code) => ["node", "-e", code], // inline JS execution
    workdir: "/app"
  },
  python: {
    image: "python:3.12-alpine",
    cmd: (code) => ["python", "-c", code], // inline Python execution
    workdir: "/app"
  },
  java: {
    image: "openjdk:21-slim",
    cmd: (code) => [
      "bash", "-lc",
      `echo '${code}' > Main.java && javac Main.java && java Main`
    ],
    workdir: "/app"
  },
  c: {
    image: "gcc:13.2",
    cmd: (code) => [
      "bash", "-lc",
      `echo '${code}' > main.c && gcc main.c -O2 -o a.out && ./a.out`
    ],
    workdir: "/app"
  },
  cpp: {
    image: "gcc:13.2",
    cmd: (code) => [
      "bash", "-lc",
      `echo '${code}' > main.cpp && g++ main.cpp -O2 -o a.out && ./a.out`
    ],
    workdir: "/app"
  },
  go: {
    image: "golang:1.22",
    cmd: (code) => [
      "bash", "-lc",
      `echo '${code}' > main.go && go run main.go`
    ],
    workdir: "/app"
  },
  rust: {
    image: "rust:1.80",
    cmd: (code) => [
      "bash", "-lc",
      `echo '${code}' > main.rs && rustc main.rs -O -o main && ./main`
    ],
    workdir: "/app"
  },
  php: {
    image: "php:8.3-cli",
    cmd: (code) => ["php", "-r", code], // inline PHP execution
    workdir: "/app"
  },
  ruby: {
    image: "ruby:3.3-alpine",
    cmd: (code) => ["ruby", "-e", code], // inline Ruby execution
    workdir: "/app"
  },
  sql: {
    image: "nouchka/sqlite3:latest",
    cmd: (code) => [
      "bash", "-lc",
      `echo "${code}" | sqlite3 :memory:`
    ],
    workdir: "/app"
  }
};
