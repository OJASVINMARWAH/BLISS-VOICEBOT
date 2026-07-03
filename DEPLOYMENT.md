# BLISS — Deployment Guide

## One-click deploy to Vercel (recommended)

Vercel is the hosting platform built by the Next.js team.  
Free tier handles ~100 GB bandwidth/month and keeps the app always warm.

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "BLISS v1"
gh repo create bliss-tutor --private --source=. --push
```

### Step 2 — Import on Vercel

1. Go to **https://vercel.com/new**
2. Click **Import Git Repository** → select `bliss-tutor`
3. Framework preset auto-detects **Next.js** ✓
4. Click **Add Environment Variables** and paste all three:

| Name | Value |
|---|---|
| `GROQ_API_KEY` | from console.groq.com |
| `SMALLEST_API_KEY` | from waves.smallest.ai |
| `BLISS_API_KEY` | any long random string (share with teammate) |

5. Click **Deploy** — done. Vercel gives you a URL like `bliss-tutor.vercel.app`.

---

## Always-on — zero cold starts

Vercel's free tier does "serverless" — functions sleep after inactivity.  
Add a free UptimeRobot ping every 5 minutes to keep it warm:

1. Go to **https://uptimerobot.com** → Create Monitor
2. Monitor Type: **HTTP(s)**
3. URL: `https://YOUR-DOMAIN/api/v1/health`
4. Interval: **5 minutes**

This hits the health endpoint every 5 minutes — keeps all functions warm, and alerts you if the service goes down.

---

## API — for your web teammate

Base URL: `https://YOUR-DOMAIN/api/v1`

All endpoints require:
```
Authorization: Bearer <BLISS_API_KEY>
Content-Type: application/json
```

---

### GET `/api/v1/health`
No auth required. Returns service status.
```bash
curl https://YOUR-DOMAIN/api/v1/health
```
```json
{ "status": "ok", "service": "BLISS AI Tutor API", "version": "1.0.0" }
```

---

### POST `/api/v1/chat`
Get a tutor reply from BLISS.
```bash
curl -X POST https://YOUR-DOMAIN/api/v1/chat \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is overfitting?",
    "history": []
  }'
```
```json
{
  "reply": "Overfitting is when a model memorises training data instead of learning patterns...",
  "tokens": 74
}
```

**With conversation history:**
```json
{
  "message": "Give me an example",
  "history": [
    { "role": "user",      "content": "What is overfitting?" },
    { "role": "assistant", "content": "Overfitting is when..." }
  ]
}
```

---

### POST `/api/v1/quiz`
Sample questions from the quiz bank (no duplicates per session).
```bash
curl -X POST https://YOUR-DOMAIN/api/v1/quiz \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "count": 5 }'
```
```json
{
  "questions": [
    {
      "id": "3",
      "module": "Introduction to AI",
      "concept": "Machine Learning",
      "difficulty": "Easy",
      "question": "How does AI work?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "AI learns from examples"
    }
  ]
}
```

---

### POST `/api/v1/tts`
Convert text to speech — returns base64 WAV.
```bash
curl -X POST https://YOUR-DOMAIN/api/v1/tts \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "text": "Hello, I am BLISS your AI tutor!" }'
```
```json
{
  "audio": "<base64-string>",
  "format": "wav",
  "sample_rate": 24000
}
```
**Play in browser:**
```js
const { audio } = await response.json();
new Audio(`data:audio/wav;base64,${audio}`).play();
```

---

## Embed BLISS as a floating widget on any website

Add one line to any HTML page:
```html
<!-- Optional config (before the script) -->
<script>
  window.BLISS_CONFIG = {
    url: "https://YOUR-DOMAIN",
    position: "bottom-right"   // or "bottom-left"
  };
</script>

<!-- The widget script -->
<script src="https://YOUR-DOMAIN/widget.js"></script>
```

This renders a floating wine-coloured button. Clicking it opens BLISS in a panel.  
Escape key closes it. No other dependencies needed.

---

## Cost breakdown (all free tiers)

| Service | Free tier | Limit |
|---|---|---|
| Vercel | 100 GB bandwidth, 6000 min build | More than enough |
| Groq | 14,400 requests/day (llama-3.3-70b) | ~300 students/day |
| Smallest AI | 10,000 chars free, then pay-as-you-go | Frugal per call |
| UptimeRobot | 50 monitors, 5-min interval | Free forever |
| GitHub | Unlimited private repos | Free |

