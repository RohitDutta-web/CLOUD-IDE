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
    cmd: ['/bin/bash'],
    HostConfig: {
      Binds: [`${userDir}:/workspace`],
      AutoRemove: false,
    }
  })
}


//temporary room container
export const createRoomContainer = async() => {}