const path = require('path')
const fs = require('fs')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const wordsRouter = require('./routes/words.js')

const app = express()
const PORT = Number(process.env.PORT) || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/antakshri'

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Load the dictionary into memory so the game can run even when MongoDB is not installed.
const dictionaryPath = path.join(__dirname, 'db', 'words_alpha.txt')
const dictionary = new Set()

try {
    const words = fs.readFileSync(dictionaryPath, 'utf8')
        .split(/\r?\n/)
        .map(word => word.trim().toLowerCase())
        .filter(Boolean)

    words.forEach(word => dictionary.add(word))
    console.log(`Dictionary loaded: ${dictionary.size.toLocaleString()} words`)
} catch (error) {
    console.error('Could not load dictionary:', error.message)
    process.exit(1)
}

app.locals.dictionary = dictionary

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'not connected',
        dictionaryWords: dictionary.size
    })
})

app.use('/api', wordsRouter)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 1500 })
        console.log('MongoDB connected')
    } catch (error) {
        console.log('MongoDB not available - using the local dictionary instead.')
    }

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`)
    })
}

startServer()
