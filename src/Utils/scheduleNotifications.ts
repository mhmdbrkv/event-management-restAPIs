import schedule from "node-schedule";
import sendEmail from "./sendEmail.js";
import ApiError from "./apiError.js";

export const scheduleEmailBeforeDate = (
  eventDate: Date,
  recipientEmail: string,
  subject: string,
  message: string,
  daysBefore: number
) => {
  // Ensure eventDate is a Date object
  const eventDateObj = new Date(eventDate);

  // Check if the conversion to a Date object was successful
  if (isNaN(eventDateObj.getTime())) {
    throw new Error("Invalid event date");
  }

  // Calculate the time to send the email (X days before the event date)
  const emailSendDate = new Date(
    eventDateObj.getTime() - daysBefore * 24 * 60 * 60 * 1000
  );

  // Check if emailSendDate is in the past
  if (emailSendDate.getTime() < Date.now()) {
    console.error("Email send date is in the past. Unable to schedule.");
    throw new ApiError("Email send date is in the past", 400);
  }

  // Schedule the email to be sent at the calculated time
  schedule.scheduleJob(emailSendDate, async () => {
    console.log(
      `Sending email to ${recipientEmail} before the event on ${emailSendDate}`
    );

    // Email Options
    const options = {
      email: recipientEmail,
      subject: subject,
      message: message,
    };

    // Sending Email
    try {
      await sendEmail(options);
      console.log(`Email successfully sent to ${recipientEmail}`);
    } catch (err) {
      console.error(`Error sending email to ${recipientEmail}:`, err);
      return new ApiError(`Error sending email: ${err}`, 500);
    }
  });

  console.log(
    `Email scheduled to be sent to ${recipientEmail} on ${emailSendDate}`
  );
  return { success: true, emailSendDate };
};
