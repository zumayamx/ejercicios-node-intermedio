import cors from 'cors'

const ACCEPTED_ORIGINS =[
    'http://localhost:8080',
    'http://localhost:3000', /* Puedes hacer esto o mirar en una base datos etc */
    'https://movies.com',
    'https://zumaya.dev'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({
    origin: (origin, callback) => {
        if ( ACCEPTED_ORIGINS.includes(origin)  || !origin ) {
            callback(null, true)
        }
        return callback(new Error('Origin NOT allowed by CORS')) /* Si no es un origen permitido (eliminar)*/
    }
})