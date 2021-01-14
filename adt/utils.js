const readline = require("readline");
const fetch = require('node-fetch')
const { Async, IO, Either, eitherToAsync } = require('crocks')
const { curry, chain } = require('ramda')
const { appendFile } = require('fs').promises
const { join } = require('path')

// askInteractive :: String -> Async Error String
const askInteractive = (msg) => {
    const reader = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false })

    return Async((_, resolve) =>
        reader.question(
            msg, 
            answer => (reader.close(), resolve(answer))
        )
    )
}

// writeLine :: String -> IO ()
const writeLine = (line) => IO(() => process.stdout.write(line))

// fetchUsers :: () -> Async Error [ User ]
const fetchUsers = Async.fromPromise(() => fetch('https://jsonplaceholder.typicode.com/users').then(response => response.json()))

// saveEmail :: Email -> Async Error Email
const saveEmail = Async.fromPromise((email) => appendFile(join(__dirname, './emails.txt'), email).then(() => email))

// show :: a -> String | a
const show = (x) => x && x['inspect'] ? x.inspect() : x

// log :: a -> ()
const log = x => console.log(show(x))

// trace :: String -> a -> ()
const trace = curry((tag, x) => console.log(tag, show(x)))

// handleException :: (a -> Boolean) -> b -> c -> a -> (a -> Either b c)
const handleException = curry((predicate, successValue, exceptionValue, val) => predicate(val) ? Either.of(successValue) : Either.Left(exceptionValue))

// flattenEither :: Async (Either b a) -> Async b a
const flattenEither = chain(eitherToAsync)

module.exports = {
    askInteractive,
    fetchUsers,
    writeLine,
    saveEmail,
    log,
    trace,
    handleException,
    flattenEither
}