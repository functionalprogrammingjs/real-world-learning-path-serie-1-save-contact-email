const { askInteractive, fetchUsers, saveEmail, handleException, trace } = require('./utils')
const { pipe, pipeK, prop, map, lift, converge, always, chain, equals } = require('ramda')
const { find, maybeToEither, Either, either, coalesce } = require('crocks')
const { yellow, green, red } = require('chalk')

//  monad transformers
const  AsyncT = require('./AsyncT')
const AsyncEither = AsyncT(Either)
const { AsyncToAsyncT } = AsyncEither

// findUserEmailByName :: String -> [ User ] -> Async (Either Message String)
const findUserEmailByName = pipe(
    (name, users) => find(user => user.name.includes(name), users),
    map(prop('email')),
    maybeToEither('No exist user email.')
)

// getUserEmailInteractive :: () -> Async (Either Message Email)
const getUserEmailInteractive = pipe(
    converge(lift(findUserEmailByName), [always(askInteractive('Please, introduce name to find Email: ')),  fetchUsers]),
    AsyncToAsyncT
)

// askSaveEmailInteractive :: Email -> Async (Either Message Email)
const askSaveEmailInteractive = (email) => pipe(
    () => askInteractive(`Do you want to save the email "${email}"? `),
    map(handleException(equals('yes'), email, 'Has decided not to save email!')),
    AsyncToAsyncT
)()

// safeSaveEmail :: Email -> Async (Either Message Email)
const safeSaveEmail = pipe(
    saveEmail,
    coalesce(always(Either.Left('Error saving Email')), Either.of),
    AsyncToAsyncT
)

// ## Program ##

// saveEmailInteractive :: () -> Async Message Email
const saveEmailInteractive = pipeK(
    getUserEmailInteractive,
    askSaveEmailInteractive,
    safeSaveEmail
)

// run program
saveEmailInteractive()
.fork(
    trace(red('Error:')), 
    either(trace(yellow('Exception:')), trace(green('Success:')))
)



