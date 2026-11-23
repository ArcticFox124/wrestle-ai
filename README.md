# 🤼 MatVision AI - Folkstyle Wrestling Video Analysis App

An AI-powered video analysis and digital film room application tailored specifically for **Folkstyle Wrestling** (US Collegiate NCAA & High School). Submit any wrestling match via **YouTube URL** or **direct video upload**, and MatVision automatically decomposes the match into moves, points, biomechanical critiques, and customized practice drills.

Deployable directly to **Vercel** with Next.js App Router and Tailwind CSS.

---

## ⚡ Key Capabilities

1. **Dual Video Ingestion**:
   - **YouTube Match Links**: Instant streaming via YouTube Iframe API with playback speed control (0.5x slow-mo for technical breakdown, 0.75x, 1x, 1.25x).
   - **Local Video Upload**: Drag & drop `.mp4`, `.mov`, or `.webm` files with HTML5 synchronized playback.
   - **Pre-loaded Demos**: High School State Finals & NCAA Division I Championship matches ready to explore immediately without an API key.

2. **Folkstyle Move & Scoring Engine**:
   - Tracks authentic Folkstyle actions: Single legs, double legs, high crotches, ankle picks, fireman's carries, standups, sit-outs, Granby rolls, switches, cradles, tilts, and near falls.
   - Live synced NCAA scoreboard tracking Red & Green points, Period (1, 2, 3, OT), and **Riding Time Advantage (+1 pt for 1:00+ control)**.

3. **Interactive Film Room**:
   - **Synchronized Timeline Scrubber**: Color-coded pins on the scrub bar mark every shot, takedown, escape, reversal, and near fall. Click any pin to jump straight to the move in the video!
   - **Sequence Event Log**: Filter by neutral shots, mat wrestling, or scrambles.

4. **Biomechanical & Technique Coaching**:
   - Evaluates the 4 pillars of Folkstyle:
     1. Stance, Motion & Setups (head position, level changes, circular footwork)
     2. Neutral Attack & Finishes (shot mechanics, corner turns, finish efficiency)
     3. Neutral Defense & Countering (sprawl reaction time, whizzers, go-behinds)
     4. Mat Wrestling (riding breakdowns, whistle explosion, hand fighting)
   - Assigns a technical rating (1-100) and details strengths vs flaws.

5. **Personalized Practice Drill Generator**:
   - Analyzes mistakes made in the match and prescribes specific drills with sets, reps, and coaching cues (e.g., *Anti-Granby Retention Drill*, *Collar Tie Re-attack & Corner Turn*).

6. **Target Wrestler Mode**:
   - Analyze **Dual Match View** (both wrestlers head-to-head) or focus exclusively on **Red Wrestler** or **Green Wrestler**.

7. **Exportable Coach Scouting Report**:
   - One-click formatted printable PDF / markdown scouting sheet to hand to athletes before practice.

---

## 🚀 Getting Started Locally

```bash
# 1. Navigate to the project directory
cd C:\Users\Gavin\.gemini\antigravity\scratch\wrestle-ai

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

This project is built with Next.js 14 and is 100% Vercel-ready:

1. Push this directory to your GitHub / GitLab repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of MatVision Wrestling App"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. Next.js will be auto-detected.
4. *(Optional)* In **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google AI Studio Gemini API key.
5. Click **Deploy**!

Users can also paste their Gemini API key directly into the in-app settings modal.
