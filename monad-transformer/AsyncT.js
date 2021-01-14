const { sequence, identity, curryN, is, reject } = require('ramda')

const AsyncT = (M) => {
    const Async = (fork) => {

        const _map = (f, fork) => Async((reject, resolve) => {
            try{
                fork(reject, (functor) => resolve(functor.map(f)))
            }catch(e){
                reject(e)
            }
        })

        const _ap = (MValue, fork) => {
            return Async((reject, resolve) => {
                try{
                    let mf = null
                    let mValue = null
                    const handleResolve = () => { if(mf && mValue) resolve(mf.ap(mValue))}
                    MValue.fork(reject, _value => { mValue = _value; handleResolve();})
                    fork(reject, _f => { mf = _f; handleResolve()})
                }catch(e){
                    console.log(e)
                    reject(e)
                }
            })
        }

        const _chain = (f, fork) => {
            return Async((reject, resolve) => {
                fork(reject, (m) => {
                    try{
                        const MAM = m.map(f)
                        const AMM = sequence(M.of, MAM)
                        AMM.fork ? 
                        AMM.fork(reject, (mm) => resolve(mm.chain(identity))) :
                        resolve(AMM.chain(identity)) 
                    }catch(e){
                        reject(e)
                    }     
                })
            })
        }

        const _inspect = () => `Async ${M.type}`


        return {
            fork,
            map: (f) => _map(f, fork),
            ap: (val) => _ap(val, fork),
            chain: (f) => _chain(f, fork),
            inspect: _inspect
        }
    }

    // lift :: Monad m => m a -> AsyncT e (m a)
    Async.lift = (m) =>  Async((_, resolve) => resolve(m))

    // lift :: Monad m => (a -> m b) -> (a -> AsyncT e (m b))
    Async.liftFn = (f) => curryN(f.length, (...args) => Async.lift(f(...args)) )

    // of :: Monad m => a -> AsyncT e (m a)
    Async.of = (x) => Async.lift(M.of(x))

    // fromPromise :: Monad m => Promise e a -> AsyncT e (m a)
    Async.fromPromise = (x) => {
        return is(Function, x) ? 
        curryN(x.length, (...args) => Async((reject, resolve) => x(...args).catch(reject).then(x => resolve(M.of(x))))) :
        Async((reject, resolve) => x.catch(reject).then(x => resolve(M.of(x))))
    }

    Async.liftAsync = x => Async((reject, resolve) => {
        x.fork(reject, x => resolve(M.of(x)))
    })

    Async.AsyncToAsyncT = x => Async((reject, resolve) => x.fork(reject, resolve))
    
    return Async
}


module.exports = AsyncT