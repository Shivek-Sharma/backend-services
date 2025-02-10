import nodemailer from "nodemailer";
import ejs from "ejs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sendMail = async (data) => {
  try {
    const templatePath = join(
      __dirname,
      "./emailTemplates",
      "dailyReport.ejs"
    );
    const htmlContent = await ejs.renderFile(templatePath, data);

    const transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      auth: {
        user: process.env.MAILGUN_USERNAME,
        pass: process.env.MAILGUN_PASSWORD,
      },
    });

    const mailOptions = {
      from: "from@xyz.com",
      to: "to@gmail.com",
      subject: "Weekly Newsletter",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent: " + info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

export default sendMail();
