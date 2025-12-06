require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ---- Google Calendar auth using service account ----
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // put your downloaded service account JSON here
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

const CALENDAR_ID = process.env.CALENDAR_ID || "primary";
const TIMEZONE = process.env.TIMEZONE || "Asia/Kolkata";

// ---- Nodemailer for email confirmation ----
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // use an app password, not your real password
  },
});

// POST /book -> create calendar event + Meet link + send email
app.post("/book", async (req, res) => {
  const { name, email, meetingType, duration, start, end } = req.body;

  if (!name || !email || !meetingType || !start || !end) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    const event = {
      summary: `${meetingType} – ${name}`,
      description: `Client: ${name}\nEmail: ${email}`,
      start: {
        dateTime: start,
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: end,
        timeZone: TIMEZONE,
      },
      attendees: [{ email }],
      conferenceData: {
        createRequest: {
          requestId: String(Date.now()),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: true,
      },
    };

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
      conferenceDataVersion: 1,
    });

    const data = response.data;

    let meetLink = "No Meet link generated";
    if (
      data.conferenceData &&
      data.conferenceData.entryPoints &&
      data.conferenceData.entryPoints.length
    ) {
      const videoEntry = data.conferenceData.entryPoints.find(
        (ep) => ep.entryPointType === "video"
      );
      if (videoEntry) meetLink = videoEntry.uri;
    }

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your appointment is confirmed",
      text: `Hi ${name},

Your meeting is confirmed.

Type: ${meetingType}
Start: ${start}
End:   ${end}

Google Meet link:
${meetLink}

Thanks,
Arajit
`,
    });

    return res.json({ success: true, meetLink });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ success: false, error: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Booking server running on http://localhost:${PORT}`);
});
