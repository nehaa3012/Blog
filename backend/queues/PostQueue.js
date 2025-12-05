import {connection} from "../utils/bullmq.js";
import { Queue } from "bullmq";

const postQueue = new Queue("post", { connection });

// postQueue.process(async (job) => {
//     console.log("Processing job:", job.data);
// });

export default postQueue;
