import Docker from "dockerode";
import fs from "fs";

const docker = new Docker();
//user private docker container
export const createUSerContainer = async (userId) => {
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
export const createRoomContainer = async (roomId ) => {
  const container = await docker.createContainer({
    Image:  "your-code-nimbus-image",
    Name: `${roomId}-image`,
    Tty: true,
    Cmd: ["/bin/sh"],
    HostConfig: {
      AutoRemove: true,
    },
  })

  await container.start();
  return container.id;
}