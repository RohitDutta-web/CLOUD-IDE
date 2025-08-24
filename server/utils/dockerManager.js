import Docker from "dockerode";
import fs from "fs";
import { PassThrough } from "stream";
import { languageDockerConfig } from "../src/Docker/languageConfig.js";
import tar from "tar-stream";

const docker = new Docker();
const containers = new Map(); // track active containers

// ---------- USER PERSISTENT CONTAINER ----------
export const createUserContainer = async (userId) => {
  const userDir = `/home/codeNimbus/user/${userId}`;
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  const containerName = `${userId}-codeNimbus-image`;
  const existing = (await docker.listContainers({ all: true }))
    .find(c => c.Names.includes(`/${containerName}`));

  if (existing) {
    console.log(`Container for ${userId} already exists.`);
    return docker.getContainer(existing.Id);
  }

  const container = await docker.createContainer({
    Image: "your-code-nimbus-image",
    name: containerName,
    Tty: true,
    Cmd: ["/bin/sh"],
    HostConfig: {
      Binds: [`${userDir}:/workspace`],
      AutoRemove: false,
    },
  });

  await container.start();
  console.log("✅ User container started");
  return container;
};

// ---------- ENSURE IMAGE ----------
async function ensuringImage(language) {
  const config = languageDockerConfig[language];
  if (!config) throw new Error(`Unsupported language: ${language}`);

  try {
    await docker.getImage(config.image).inspect();
    console.log(`✅ Image ${config.image} exists`);
  } catch {
    console.log(`⬇️ Pulling image ${config.image}...`);
    await new Promise((resolve, reject) => {
      docker.pull(config.image, (err, stream) => {
        if (err) return reject(err);
        docker.modem.followProgress(stream, resolve, (e) =>
          e.status && process.stdout.write(`\r${e.status} ${e.progress || ""}`)
        );
      });
    });
    console.log(`\n✅ Pulled image ${config.image}`);
  }
}

// ---------- ROOM CONTAINER ----------
export async function getRoomContainer(language, roomId) {
  const config = languageDockerConfig[language];
  const containerName = `${language}_${roomId}_room_container`;

  const existing = (await docker.listContainers({ all: true }))
    .find(c => c.Names[0].includes(containerName));

  let container;
  if (existing) {
    container = docker.getContainer(existing.Id);
    const state = (await container.inspect()).State;
    if (state.Status !== "running") await container.start();
  } else {
    await ensuringImage(language);
    container = await docker.createContainer({
      Image: config.image,
      name: containerName,
      Tty: false,
      Cmd: ["tail", "-f", "/dev/null"], // keep alive
      HostConfig: {
        AutoRemove: false,
        Memory: 256 * 1024 * 1024,
        CpuShares: 256,
      },
      WorkingDir: "/app",
    });
    await container.start();
    console.log("✅ Room container created:", containerName);
  }

  containers.set(containerName, Date.now());
  return container;
}

// ---------- RUN CODE IN ROOM ----------
export const runRoomCode = async (language, roomId, filename, code, io) => {
  const config = languageDockerConfig[language];
  if (!config) {
    io.to(roomId).emit("codeOutput", { output: "Unsupported language" });
    return;
  }

  // get (or create) room container
  const container = await getRoomContainer(language, roomId);

  // pack code file
  const pack = tar.pack();
  pack.entry({ name: filename }, code);
  pack.finalize();
  await container.putArchive(pack, { path: config.workdir });

  // exec process in existing container
  const exec = await container.exec({
    Cmd: config.cmd,
    AttachStdout: true,
    AttachStderr: true,
    WorkingDir: config.workdir,
  });

  const execStream = await exec.start({ hijack: true, stdin: false });

  const stdout = new PassThrough();
  const stderr = new PassThrough();
  docker.modem.demuxStream(execStream, stdout, stderr);

  stdout.on("data", (chunk) => {
    io.to(roomId).emit("codeOutput", { output: chunk.toString() });
  });
  stderr.on("data", (chunk) => {
    io.to(roomId).emit("codeOutput", { output: chunk.toString() });
  });
};

// ---------- CLEANUP ----------
export async function cleanupIdleContainers(idleMinutes = 30) {
  const now = Date.now();
  for (let [name, lastActive] of containers.entries()) {
    if (now - lastActive > idleMinutes * 60 * 1000) {
      try {
        const container = docker.getContainer(name);
        await container.stop().catch(() => {});
        await container.remove().catch(() => {});
        console.log(`🗑️ Cleaned up idle container: ${name}`);
      } catch (err) {
        console.error(`Error removing container ${name}:`, err);
      }
      containers.delete(name);
    }
  }
}
