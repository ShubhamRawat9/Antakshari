const express = require('express')
const Word = require('../model/Word.js')

const router = express.Router()

function getDictionary(req) {
    return req.app.locals.dictionary
}

function getRandomFromSet(set) {
    const words = Array.from(set)
    return words[Math.floor(Math.random() * words.length)]
}

async function getRandomWord(req) {
    const dictionary = getDictionary(req)

    // Prefer MongoDB when it is connected and has data.
    if (req.app.locals && req.app.locals.dictionary && Word.db.readyState === 1) {
        const count = await Word.countDocuments()
        if (count > 0) {
            const random = Math.floor(Math.random() * count)
            const word = await Word.findOne().skip(random).lean()
            if (word?.word) return word.word
        }
    }

    return getRandomFromSet(dictionary)
}

router.get('/start', async (req, res) => {
    try {
        const randomWord = await getRandomWord(req)
        res.json({ word: randomWord })
    } catch (error) {
        console.error('Start game error:', error)
        res.status(500).json({ error: 'Unable to start the game' })
    }
})

router.post('/validate', async (req, res) => {
    try {
        const word = String(req.body.word || '').trim().toLowerCase()
        const previousWord = String(req.body.previousWord || '').trim().toLowerCase()

        if (!word || !previousWord) {
            return res.status(400).json({ error: 'Word and previous word are required' })
        }

        if (!/^[a-z]+$/.test(word) || !/^[a-z]+$/.test(previousWord)) {
            return res.json({ valid: false, message: 'Please enter a word using English letters only' })
        }

        const lastLetter = previousWord.slice(-1)
        if (word[0] !== lastLetter) {
            return res.json({
                valid: false,
                message: `Your word must start with "${lastLetter.toUpperCase()}"`
            })
        }

        const dictionary = getDictionary(req)
        let isValidWord = dictionary.has(word)

        if (!isValidWord && Word.db.readyState === 1) {
            isValidWord = Boolean(await Word.exists({ word }))
        }

        if (!isValidWord) {
            return res.json({ valid: false, message: 'That word is not in the dictionary' })
        }

        const nextWord = await getRandomWord(req)
        return res.json({ valid: true, nextWord })
    } catch (error) {
        console.error('Validate word error:', error)
        return res.status(500).json({ error: 'Unable to validate the word' })
    }
})

module.exports = router
