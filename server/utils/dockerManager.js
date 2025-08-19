import Docker from "dockerode";
import fs from "fs";
import  {languageDockerConfig}  from "../src/Docker/languageConfig.js";
import tar from "tar-stream";

const docker = new Docker();

//keep track of every containers
const containers = new Map();


//user private docker container
export const createUserContainer = async (userId) => {
  const userDir = `/home/codeNimbus/user/${userId}`
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  const containerName = `${userId}-codeNimbus-image`;

  // Check if the container already exists
  const containers = await docker.listContainers({ all: true });
  const existing = containers.find(c => c.Names.includes(`/${containerName}`));

  if (existing) {
    console.log(`Container for ${userId} already exists. Connecting to container .`);
    return docker.getContainer(existing.Id); // return existing container
  }

  const container = await docker.createContainer({
    Image: "your-code-nimbus-image",
    name: `${userId}-codeNimbus-image`,
    Tty: true,
    Cmd: ['/bin/sh'],
    HostConfig: {
      Binds: [`${userDir}:/workspace`],
      AutoRemove: false,
    }
  })
  console.log("User container is on!");
  await container.start()
  return container.id;
}


//temporary room container


//ensuring image
async function ensuringImage(language) {
  const config = languageDockerConfig[language];
  if (!config) throw new Error(`Unsupported language: ${language}`);

  const imageName = config.image;
  try {
    await docker.getImage(imageName).inspect();
    console.log(`✅ Image ${imageName} exists`);
  } catch (err) {
    console.log(`⬇️ Pulling image ${imageName}...`);
    await new Promise((resolve, reject) => {
      docker.pull(imageName, (err, stream) => {
        if (err) return reject(err);
        docker.modem.followProgress(stream, onFinished, onProgress);

        function onFinished(err, output) {
          if (err) reject(err);
          else resolve(output);
        }

        function onProgress(event) {
          if (event.status) {
            process.stdout.write(`\r${event.status} ${event.progress || ""}`);
          }
        }
      });
    });
    console.log(`\n✅ Pulled image ${imageName}`);
  }
}



//find and start room container
export async function getRoomContainer(language, roomId) {
  //getting language configurations
  const config = languageDockerConfig[language];

  const containerName = `${language}_${roomId}_room_container`
  const existingContainers = await docker.listContainers({ all: true });
  const existingContainer = existingContainers.find(container => container.Names[0].includes(`${containerName}`));

  let container;

  if (existingContainer) {
 
    container = docker.getContainer(existingContainer.Id);
    const activityInspect = await container.inspect();
    if (activityInspect.State.Status !== "running") {
      await container.start()
    }
  } else {
 
    await ensuringImage(language)
    container = await docker.createContainer({
      Image: config.image,
      name: containerName,
      Tty: false,
      Cmd: ["tail", "-f", "/dev/null"],
      HostConfig: {
        AutoRemove: false,
        Memory: 256 * 1024 * 1024,
        CpuShares: 256
      },
      WorkingDir: "/app"
    })
    console.log("container created")
 console.log(await container.inspect())

    await container.start();

  }

  containers.set(containerName, Date.now());


  return container;
}


//runs the code
export async function runRoomCode(language, roomId, fileName, code, socket) {
  const config = languageDockerConfig[language];
  if (!config) throw new Error("Language not supported");

  const container = await getRoomContainer(language, roomId);

  // put source file into /app
  const tarPack = tar.pack();
  tarPack.entry({ name: fileName }, code);
  tarPack.finalize();
  await container.putArchive(tarPack, { path: "/app" });

  // create exec
  const exec = await container.exec({
    Cmd: config.cmd,
    AttachStdout: true,
    AttachStderr: true,
    WorkingDir: "/app",
  });

  return new Promise((resolve, reject) => {
    exec.start({ hijack: true, stdin: false }, (err, stream) => {
      if (err) return reject(err);

      // demux stdout/stderr
      let stdout = "";
      let stderr = "";

      container.modem.demuxStream(
        stream,
        {
          write: (chunk) => {
            const text = chunk.toString();
            stdout += text;
            socket.emit("codeOutput", { type: "stdout", data: text }); // send to frontend in realtime
          },
        },
        {
          write: (chunk) => {
            const text = chunk.toString();
            stderr += text;
            socket.emit("codeOutput", { type: "stderr", data: text }); // send to frontend in realtime
          },
        }
      );

      stream.on("end", () => {
        containers.set(`${language}_${roomId}_room_container`, Date.now());
        resolve({ stdout, stderr });
      });
    });
  });
}



export async function cleanupIdleContainers(idleMinutes = 30) {
  const now = Date.now();
  for (let [name, lastActive] of containers.entries()) {
    if (now - lastActive > idleMinutes * 60 * 1000) {
      try {
        const container = docker.getContainer(name);
        await container.stop().catch(() => {});
        await container.remove().catch(() => {});
      } catch (err) {
        console.error(`Error removing container ${name}:`, err);
      }
      containers.delete(name);
    }
  }
}