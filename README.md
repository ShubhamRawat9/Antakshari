# Word Antakshri

A simple web-based word-chain game built with Node.js, Express, MongoDB/Mongoose, HTML, CSS and JavaScript.

## What was fixed

- Fixed the dictionary path (`db/words_alpha.txt`).
- Added Express static-file serving for `public/`.
- Fixed API paths so the frontend works from the same server.
- Added a local in-memory dictionary fallback, so the game can run even when MongoDB is not installed or running.
- Kept MongoDB support for persistent dictionary storage when MongoDB is available.
- Added safer API error handling and input validation.
- Added `npm start`, `npm run dev`, and `npm run load-db` scripts.
- Added a Windows `start.bat` launcher.
- Removed the unnecessary `fs` npm dependency.
- Improved the frontend UI and mobile responsiveness.

## Requirements

- Node.js 18 or newer
- MongoDB is optional for normal gameplay.

## Run the project

### Windows — easiest method

Double-click `start.bat`.

Or use VS Code Terminal:

```bash
npm install
npm start
```

Then open:

```text
http://localhost:5000
```

The application loads `db/words_alpha.txt` automatically. You do **not** need to move the dictionary file.

## Optional MongoDB setup

If MongoDB is installed and running at:

```text
mongodb://127.0.0.1:27017
```

the server will connect automatically.

To populate MongoDB with the dictionary:

```bash
npm run load-db
```

MongoDB is not required for the game because the server automatically falls back to the local dictionary.

## API

- `GET /api/start` — returns a random starting word.
- `POST /api/validate` — validates a submitted word and returns the next word.
- `GET /api/health` — shows server, MongoDB and dictionary status.

## Project structure

```text
Antakshri/
├── db/
│   ├── wordsLoader.js
│   └── words_alpha.txt
├── model/
│   └── Word.js
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── routes/
│   └── words.js
├── screenshots/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── readme.md
├── server.js
└── start.bat
```
