# Word Antakshri

A simple web-based word game inspired by Antakshri. The game gives the player a word, and the player must respond with a valid English dictionary word whose first letter matches the last letter of the displayed word.

Each accepted word adds its character count to the score. The application uses Express and MongoDB for the game API, with a lightweight HTML/CSS/JavaScript interface.

## Features

- Random starting word from a dictionary stored in MongoDB
- Word validation against the dictionary
- Last-letter matching rule enforcement
- Live score tracking
- Responsive browser interface

## Tech stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express, CORS
- **Database:** MongoDB with Mongoose

## Prerequisites

- Node.js 14 or later
- MongoDB running locally on port `27017`

## Install

From the project directory, install the server dependencies:

```bash
npm install
```

The application expects MongoDB at:

```text
mongodb://127.0.0.1:27017/antakshari
```

## Run locally

Start the API server in one terminal:

```bash
node server.js
```

The API starts at `http://localhost:5000`.

The current server implementation exposes API routes only, so serve the `public` directory in a second terminal. For example, with Python:

```bash
python -m http.server 5001 --directory public
```

Then open `http://localhost:5001` in a browser.

## How to play

1. The game displays a random word.
2. Enter an English word that starts with the final letter of that word.
3. Submit it with the button or Enter.
4. A valid word earns points equal to its length, then the game displays a new word.

For example, if the displayed word is `music`, your next word must start with `c`.

## API

### `GET /api/start`

Returns a random starting word.

```json
{ "word": "example" }
```

### `POST /api/validate`

Validates a submitted word.

Request body:

```json
{ "word": "elephant", "previousWord": "example" }
```

Successful response:

```json
{ "valid": true, "nextWord": "tree" }
```

## Project structure

```text
public/          Browser interface
routes/words.js  Game API endpoints
model/Word.js    MongoDB word schema
db/              Dictionary data and loader script
server.js        Express application entry point
```

## Dictionary setup

The included `db/words_alpha.txt` file is the source dictionary. The database used by the running project has already been populated. Before using this project on a new machine, load that dictionary into MongoDB.

> Note: `db/wordsLoader.js` currently needs a MongoDB connection and a correct path to `words_alpha.txt` before it can be used as a standalone loader. The game itself works once the `antakshari` database contains `Word` documents.

## Known implementation detail

`server.js` does not currently serve the `public/` folder. That is why the setup above runs a static server on port `5001` alongside the API on port `5000`. Alternatively, add `app.use(express.static('public'))` to `server.js` to serve the UI from the same port.
