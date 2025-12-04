import { Worker } from "bullmq";
import {connection} from "../utils/bullmq.js";
import nodemailer from "nodemailer";

console.log("Worker starting...");
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_USER:", process.env.SMTP_USER);

// email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// worker for postjobs 
const worker = new Worker("post", async (job) => {
    console.log("Processing job:", job.data);
    const { post, email } = job.data;
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email, // Use the email passed from the controller
        subject: "New Post",
        text: `A new post has been created: ${post.title}`,
    };
    await transporter.sendMail(mailOptions);
}, { connection });

// handel job completion
worker.on('completed', (job) => console.log(`Job ${job.id} done!`));
worker.on('failed', (job, err) => console.error(`Job ${job.id} failed:`, err));

// gracefully shutdown
process.on('SIGTERM', async () => {
  await worker.close();
  process.exit(0);
});

console.log("Post worker is now running and listening for jobs...");