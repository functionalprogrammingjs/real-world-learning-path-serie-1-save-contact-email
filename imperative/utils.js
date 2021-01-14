const readline = require("readline");
const fetch = require('node-fetch')
const { appendFile } = require('fs').promises
const { join } = require('path')

// askInteractive :: String -> Promise Error String
const askInteractive = (msg) => {
    const reader = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false })
    return new Promise((resolve) => reader.question(msg, (answer) => (reader.close(), resolve(answer.trim()))))
}

// writeLine :: String -> ()
const writeLine = (line) => process.stdout.write(line)

// fetchUsers :: () -> Promise Error [ User ]
const fetchUsers = () => fetch('https://jsonplaceholder.typicode.com/users').then(response => response.json())

// saveEmail :: Email -> Promise Error Email
const saveEmail = (email) => appendFile(join(__dirname, './emails.txt'), email).then(() => email)

// show :: a -> String | a
const show = (x) => x && x['inspect'] ? x.inspect() : x

// log :: a -> ()
const log = x => console.log(show(x))

// trace :: String -> a -> ()
const trace = (tag, x) => console.log(tag, show(x))

module.exports = {
    askInteractive,
    fetchUsers,
    writeLine,
    saveEmail,
    log,
    trace
}