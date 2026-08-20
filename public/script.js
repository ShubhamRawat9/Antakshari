const currentWordDisplay = document.getElementById('current-word')
const wordInput = document.getElementById('word-input')
const submitWordButton = document.getElementById('submit-word')
const messageDisplay = document.getElementById('message')
const scoreDisplay = document.getElementById('score')

let score = 0
let previousWord = ''
let busy = false

async function startGame() {
    try {
        messageDisplay.textContent = 'Starting game...'
        const response = await fetch('/api/start')
        const data = await response.json()

        if (!response.ok) throw new Error(data.error || 'Unable to start game')

        currentWordDisplay.textContent = data.word
        previousWord = data.word
        score = 0
        scoreDisplay.textContent = score
        messageDisplay.textContent = 'Enter a word beginning with the last letter.'
        wordInput.focus()
    } catch (error) {
        messageDisplay.textContent = error.message
    }
}

async function validateWord(word) {
    const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, previousWord })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'An error occurred')
    return data
}

async function submitWord() {
    if (busy) return

    const word = wordInput.value.trim()
    if (!word) {
        messageDisplay.textContent = 'Please enter a word.'
        wordInput.focus()
        return
    }

    busy = true
    submitWordButton.disabled = true

    try {
        const result = await validateWord(word)

        if (result.valid) {
            score += word.length
            scoreDisplay.textContent = score
            currentWordDisplay.textContent = result.nextWord
            previousWord = result.nextWord
            messageDisplay.textContent = `Correct! +${word.length} points`
        } else {
            messageDisplay.textContent = result.message
        }
    } catch (error) {
        messageDisplay.textContent = error.message
    } finally {
        wordInput.value = ''
        wordInput.focus()
        busy = false
        submitWordButton.disabled = false
    }
}

submitWordButton.addEventListener('click', submitWord)

wordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') submitWord()
})

startGame()

