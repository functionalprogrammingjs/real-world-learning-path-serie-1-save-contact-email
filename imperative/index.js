const { askInteractive, fetchUsers, saveEmail, trace } = require('./utils')
const { yellow, green } = require('chalk')

// traceSuccess :: String -> ()
const traceSuccess = (msg) => trace(green('Success:'), msg)

// traceException :: String -> ()
const traceException = (msg) => trace(yellow('Exception:'), msg)

// findUserEmailByName :: (String, [ User ]) -> Email | null
const findUserEmailByName = (name, users) => {
    const user = users.find(user => user.name.includes(name))
    return user ? user.email : null
}

// saveEmailInteractive :: () -> Promise Error ()
const saveEmailInteractive = async () => {
    const name = await askInteractive('Please, introduce name to find Email: ')
    const users = await fetchUsers()
    const email = findUserEmailByName(name, users)

    if(email){
        const saveEmailAnswer = await askInteractive(`Do you want to save the email "${email}"? `)

        if(saveEmailAnswer === 'yes') {
            try{
                await saveEmail(email)
                traceSuccess(`Email saved ${email}!`)
            }catch(e){
                traceException('Error saving email, try again!')
            }
        }else{
            traceException('Has decided not to save email!')
        }
    }else {
        traceException(`No exist user email.`)
    }
} 

// run program
saveEmailInteractive()