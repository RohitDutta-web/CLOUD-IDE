//language configuration details for docker containers
export const languageDockerConfig = {
  node:   { image: "node:20-alpine",      cmd: ["node", "main.js"],   workdir: "/app" },
  python: { image: "python:3.12-alpine",  cmd: ["python", "main.py"], workdir: "/app" },
  java:   { image: "openjdk:21-slim",     cmd: ["bash","-lc","javac Main.java && java Main"], workdir: "/app" },
  c:      { image: "gcc:13.2",            cmd: ["bash","-lc","gcc main.c -O2 -o a.out && ./a.out"], workdir: "/app" },
  cpp:    { image: "gcc:13.2",            cmd: ["bash","-lc","g++ main.cpp -O2 -o a.out && ./a.out"], workdir: "/app" },
  go:     { image: "golang:1.22",         cmd: ["go","run","main.go"], workdir: "/app" },
  rust:   { image: "rust:1.80",           cmd: ["bash","-lc","rustc main.rs -O -o main && ./main"], workdir: "/app" },
  php:    { image: "php:8.3-cli",         cmd: ["php","index.php"],   workdir: "/app" },
  ruby:   { image: "ruby:3.3-alpine",     cmd: ["ruby","main.rb"],    workdir: "/app" },
  sql:    { image: "nouchka/sqlite3:latest", cmd: ["sqlite3", ":memory:", ".read main.sql"], workdir: "/app" },
};
