import Docker from "dockerode";

const docker = new Docker();

export const langContainer = async (image, cmd) => {
  
  const container = await docker.createContainer({
  Image: image,
  Cmd: [cmd, 'code.js'],
  Tty: false,
  HostConfig: {
    AutoRemove: true,
    Binds: [`/host/temp/folder:/app`],
  },
  WorkingDir: '/app',
});
await container.start();

}