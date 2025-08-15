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



//find and start room container
export async function getRoomContainer(language, roomId) {
  //getting language configurations
  const config = languageDockerConfig[language];

  const containerName = `${language}_${roomId}_room_container`
  const existingContainers = await docker.listContainers({ all: true });
  const existingContainer = existingContainers.find(container => container.Names.includes(`${containerName}`));
  let container;

  if (existingContainer) {
    container = docker.getContainer(existingContainer.Id);
    const activityInspect = await container.inspect();
    if (activityInspect.State.Status !== "running") {
      await container.start()
    }
  } else {
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

    await container.start();

  }

  containers.set(containerName, Date.now());

  return container;
}


export async function runRoomCode(language, roomId, fileName, code) {
  console.log(language, roomId, fileName, code);
  const config = languageDockerConfig[language];
  console.log(config)

  const container = await getRoomContainer(language, roomId);

  console.log(container)

  /*
  creating tarball as we will put the file into container and archive it 
  into app directory inside  container
  */
  const tarPack = tar.pack();
tarPack.entry({ name: fileName }, code);

  tarPack.finalize();

  await container.putArchive(tarPack, { path: "/app" });

  // executing the code

  const exec = await container.exec({
    Cmd: config.cmd,
    AttachStderr: true,
    AttachStdin: true,
    WorkingDir: "/app"
  })

  return new Promise((resolve, reject) => {

    exec.start((err, stream) => {
      if (err) return reject(err);
      let outPut = "";
      stream.on("data", chunk => (outPut += chunk.toString()));
       stream.on("end", () => {
        containerActivity.set(`${language}_room_${roomId}`, Date.now());
        resolve(outPut);
      });
    })
  })

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