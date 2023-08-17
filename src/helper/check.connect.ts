import mongoose from "mongoose";
import os from "os";
import process from "process";
const _SECONDS = 5000;
export const countConnect = () => {
  //@ts-ignore
  const numConnection: any = mongoose.connection?.length;
  console.log("Number of connection mongodb", numConnection);
};

export const checkOverload = () => {
  setInterval(() => {
  //@ts-ignore
    const numConnection: any = mongoose.connection?.length;
    const numCores = os.cpus().length;
    const memoryUse = process.memoryUsage().rss;

    //example maximum number of connections based on number osf cores
    const maxConnections = numCores * 5;

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage::,${memoryUse / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log("Connection overload detected!");
    }
  }, _SECONDS); //Monitor every 5 seconds
};
