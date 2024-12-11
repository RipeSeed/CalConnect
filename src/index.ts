import express, { Request, Response } from "express";
import { CalendarService } from "./services/calender.service.js";

const app = express();
const port = 3000;
const clientId = "919434230087-pate7tm5eohs7aaccdl540hfjm5onnk7.apps.googleusercontent.com";
const clientSecret = "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";
const redirectUri = "https://2295-119-156-116-75.ngrok-free.app/auth/callback";
const mongoDB = "mongodb://admin:password@localhost:27017";

const calender = new CalendarService(
  "google",
  {
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri,
  },
  mongoDB,
);

app.get("/connect", async (req: Request, res: Response): Promise<void> => {
  calender.connect();
  res.status(200).json({ success: true });
});

app.get("/event", async (req: Request, res: Response): Promise<void> => {
  const dummyUserId = "testing_user_ripeseed";
  const dummyStartDate = "2024-12-10T00:00:00";
  const dummyEndDate = "2024-12-10T23:59:59";
  const dummyTimezone = "Asia/Karachi";

  try {
    const data = await calender.getEventsInRange(dummyUserId, dummyStartDate, dummyEndDate, dummyTimezone);

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get("/refresh", async (req: Request, res: Response): Promise<void> => {
  const dummyUserId = "testing_user_ripeseed";

  try {
    const data = await calender.refreshAccessToken(dummyUserId);

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get("/create-event", async (req: Request, res: Response): Promise<void> => {
  const userId = "testing_user_ripeseed";
  const summary = "Team Meeting";
  const start = "2024-12-10T18:00:00";
  const end = "2024-12-10T19:00:00";
  const timezone = "Asia/Karachi";
  const description = "Discuss project milestones";
  const attendees = [{ email: "john.doe@example.com" }, { email: "jane.doe@example.com" }];
  const calendarId = "primary";

  try {
    const eventDetails = await calender.createEvent(
      userId,
      summary,
      start,
      end,
      timezone,
      description,
      attendees,
      calendarId,
    );

    res.status(200).json({ success: true, data: eventDetails });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/auth/callback", async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code as string | undefined;

  if (!code) {
    res.status(400).json({ error: "No authorization code provided." });
    return;
  }

  try {
    const tokens = await calender.access(code, "testing_user_ripeseed");
    res.status(200).json({ tokens });
  } catch (error) {
    console.error("Error during authentication", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

calender.startJob();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
