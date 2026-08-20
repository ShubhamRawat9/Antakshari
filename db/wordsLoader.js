const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const Word = require('../model/Word.js')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/antakshri'
const dictionaryPath = path.join(__dirname, 'words_alpha.txt')

async function loadWords() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('MongoDB connected')

        const data = fs.readFileSync(dictionaryPath, 'utf8')
        const words = [...new Set(
            data
                .split(/\r?\n/)
                .map(word => word.trim().toLowerCase())
                .filter(word => /^[a-z]+$/.test(word))
        )]

        await Word.deleteMany({})
        await Word.insertMany(words.map(word => ({ word })), { ordered: false })

        console.log(`Database populated successfully with ${words.length.toLocaleString()} words.`)
    } catch (error) {
        console.error('Error populating database:', error.message)
        process.exitCode = 1
    } finally {
        await mongoose.disconnect().catch(() => {})
    }
}

loadWords()
