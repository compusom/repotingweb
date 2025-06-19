# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

4. To generate a static build:
   `npm run build`
   The compiled files will be in the `dist/` folder. Open `dist/index.html` in your browser to view the app without a server.

5. Optionally preview the build with:
   `npm run preview`
