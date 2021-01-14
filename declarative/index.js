const { askInteractive, fetchUsers, saveEmail, trace, notifyException } = require('./utils')
const { pipe, find, __, includes, propSatisfies, prop, apply, andThen, when, isNil, always, equals, ifElse } = require('ramda')
const { yellow, green } = require('chalk')

// findUserEmailByName :: (String, [ User ]) -> Email | undefined
const findUserEmailByName = pipe(
    (name, users) => find(propSatisfies(includes(name), 'name'), users),
    prop('email')
)

// getUserEmailInteractive :: () -> Promise Message Email
const getUserEmailInteractive = pipe(
    () => Promise.all([askInteractive('Please, introduce name to find Email: '), fetchUsers()]),
    andThen(apply(findUserEmailByName)),
    andThen(when(isNil, notifyException(`No exist user email.`)))
)

// askSaveEmailInteractive :: Email -> Promise Message Email
const askSaveEmailInteractive = (email) => pipe(
    () => askInteractive(`Do you want to save the email "${email}"? `),
    andThen(ifElse((equals('yes')), always(email), notifyException('Has decided not to save email!')))
)()

// ## Program ##

// saveEmailInteractive :: () -> Promise Message Email
const saveEmailInteractive = pipe(
    getUserEmailInteractive,
    andThen(askSaveEmailInteractive),
    andThen(saveEmail)
)

// run program
saveEmailInteractive()
.then(trace(green('Success:')))
.catch(trace(yellow('Exception:')))