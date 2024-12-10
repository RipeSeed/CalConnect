import express, { Request, Response } from "express";
import { CalendarService } from "./services/calender.service.js";

const app = express();
const port = 3000;
const clientId = "919434230087-pate7tm5eohs7aaccdl540hfjm5onnk7.apps.googleusercontent.com";
const clientSecret = "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";
const redirectUri = "https://2295-119-156-116-75.ngrok-free.app/auth/callback";

const calender = new CalendarService("google", {
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri,
});

app.get("/connect", async (req: Request, res: Response): Promise<void> => {
  calender.connect();
  res.status(200).json({ success: true });
});

app.get("/auth/callback", async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code as string | undefined;
  console.log("====code in API===> ", code);

  if (!code) {
    res.status(400).json({ error: "No authorization code provided." });
    return;
  }

  try {
    const tokens = await calender.access(code);
    res.status(200).json({ tokens });
  } catch (error) {
    console.error("Error during authentication", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
