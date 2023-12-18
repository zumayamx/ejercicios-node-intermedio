const express = require('express') /* Common JS */
const crypto = require('node:crypto')
const movies = require('./movies.json')
const cors = require('cors')    
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

/* Metodos normales: GET, HEAD, POST */
/* Metodos complejos: PUT, DELETE, PATCH */
/* CORS PRE-FLIGHT, metodo especial OPTIONS (verbo), antes de hacer un metodo complejo */

const app = express()
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS =[
            'http://localhost:8080',
            'http://localhost:3000', /* Puedes hacer esto o mirar en una base datos etc */
            'https://movies.com',
            'https://zumaya.dev'
        ]
        if ( ACCEPTED_ORIGINS.includes(origin)  || !origin) {
            callback(null, true)
        }
        return callback(new Error('Origin NOT allowed by CORS')) /* Si no es un origen permitido (eliminar)*/
    }
})) /* Esto sin parametros permite a todos los origenes (no recomendado) */
app.disable('x-powered-by')

const ACCEPTED_ORIGINS =[
    'http://localhost:8080',
    'http://localhost:3000', /* Puedes hacer esto o mirar en una base datos etc */
    'https://movies.com',
    'https://zumaya.dev'
]

app.get('/movies', (req, res) => {
    const origin = req.header('origin')
    if ( ACCEPTED_ORIGINS.includes(origin)  || !origin) {
    res.header('Access-Control-Allow-Origin', origin) /* Solucion a error CORS */
    }

    const { genre } = req.query
    if ( genre ) {
        const filteredMovies = movies.filter (
           /* movie => movie.genre.includes(genre) */   
           movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
const { id } = req.params 
const movie = movies.find(movie => movie.id === id)

if ( movie ) return res.json(movie)

res.status(404).json({ message: 'Movie not found'})
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)

    if ( result.error ) {
        return res.status(400).json({ error: JSON.parse(result.error.message)})
    }

    const newMovie = {
        id: crypto.randomUUID(), /* Indentificador Unico Universal */
        ...result.data
    }

     /* Esto no es REST, porque estamos guardando el estado de aplicación en memoria */
    movies.push(newMovie)
    res.status(201).json(newMovie) /* Actualizar cache del cliente */
})

app.delete('/movies/:id', (req, res) => {
    const origin = req.header('origin')
    if ( ACCEPTED_ORIGINS.includes(origin)  || !origin) {
    res.header('Access-Control-Allow-Origin', origin) /* Solución error CORS DELETE METHOD DOBLE*/
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if ( movieIndex === -1 ) {
        return res.status(400).json({ message: 'Movie not found'})
    }

    movies.splice(movieIndex, 1)
    return res.json({ message: 'Movie deleted'})
})

app.patch('/movies/:id', (req, res) => {
    const result =validatePartialMovie(req.body)

    if ( !result.success ) {
        return res.status(400).json({ error: JSON.parse(result.error.message)})
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    
    if ( movieIndex === -1 ) {
        return res.status(400).json({ message: 'Movie not found'})
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie
    return res.json(updateMovie)
})

app.options('/movies/:id', (req, res) => {
    const origin = req.header('origin')
    if ( ACCEPTED_ORIGINS.includes(origin)  || !origin) {
    res.header('Access-Control-Allow-Origin', origin) /* Solucion a error CORS para metodos complejos*/
    res.header('Access-Control-Allow-Methods', 'PUT, DELETE, PATCH, OPTIONS')
    }
    res.send(200)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})

/* Path: schemas/movies.js */