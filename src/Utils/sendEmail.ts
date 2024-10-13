import nodemailer from "nodemailer";

interface Options {
  email: string;
  subject: string;
  message: string;
}

export default async (options: Options) => {
  // Create a transporter object using nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10), // false-587. true-465
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //------------------------------------------------//
  const emailOptions = {
    from: "Event-Management-System <barakamohamed946@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //------------------------------------------------//

  // Send the email using the transporter
  await transporter.sendMail(emailOptions);
};
