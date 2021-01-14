const { askInteractive, fetchUsers, saveEmail, handleException, flattenEither, trace } = require('./utils')
const { pipe, pipeK, prop, map, lift, converge, always, chain, equals } = require('ramda')
const { find, maybeToEither } = require('crocks')
const { yellow, green } = require('chalk')

// findUserEmailByName :: String -> [ User ] -> Async (Either Message String)
const findUserEmailByName = pipe(
    (name, users) => find(user => user.name.includes(name), users),
    map(prop('email')),
    maybeToEither('No exist user email.')
)

// getUserEmailInteractive :: () -> Async (Either Message Email)
const getUserEmailInteractive = pipe(
    converge(lift(findUserEmailByName), [always(askInteractive('Please, introduce name to find Email: ')),  fetchUsers]),
)

// askSaveEmailInteractive :: Email -> Async (Either Message Email)
const askSaveEmailInteractive = (email) => pipe(
    () => askInteractive(`Do you want to save the email "${email}"? `),
    map(handleException(equals('yes'), email, 'Has decided not to save email!'))
)()

// ## Program ##

// saveEmailInteractive :: () -> Async Message Email
const saveEmailInteractive = pipeK(
    pipe(getUserEmailInteractive, flattenEither),
    pipe(askSaveEmailInteractive, flattenEither),
    saveEmail
)

// run program
saveEmailInteractive()
.fork(
    trace(yellow('Exception:')), 
    trace(green('Success::'))
)

