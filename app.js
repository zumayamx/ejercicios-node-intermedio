import express, { json } from 'express' 
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
//import movies from './movies.json' <-- Esto no es válido en ECMAScriptModules
 

const app = express()
app.use(json())
app.use(corsMiddleware()) /* Aqui podrias pasar acceptedOroigins, tambien funciona por default */
app.disable('x-powered-by') 

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})

