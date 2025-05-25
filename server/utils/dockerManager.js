import Docker from "dockerode";
import fs from "fs";

const docker = new Docker();
//user private docker container
export const createUSerContainer = async (userId) => {
  const userDir = `/home/codeNimbus/user/${userId}`
  if (fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  const container = await docker.createContainer({
    Image: "your-sandbox-image",
    name: `${userId}-codeNimbus-image`,
    Tty: true,
    Cmd: ['/bin/bash'],
    HostConfig: {
      Binds: [`${userDir}:/workspace`],
      AutoRemove: false,
    }
  })

  await container.start()
  return container.id;
}


//temporary room container
export const createRoomContainer = async (roomId) => {
  const container = await docker.createContainer({
    Image: "you-sandbox-image",
    Name: `${roomId}-image`,
    Tty: true,
    Cmd: ["/bin/bash"],
    HostConfig: {
      AutoRemove: true,
    },
  })

  await container.start();
  return container.id;
}