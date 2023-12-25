import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils.js'
const movies = readJSON('./movies.json')

export class MovieModel { /* Podria hacer un sistema que maneje errores de servidor y asi manejar un error de forma más objetiva */
    static async getAll ({ genre }) {
        if ( genre ) {
            return movies.filter(movie => movie.genre.some (g => g.toLowerCase() === genre.toLowerCase()))
        }
        return movies
    }

    static async getById ({ id }) { /* Pasar directamente objetos */
        const movie = movies.find(movie => movie.id === id)
        return movie || null
    }

    static async create ({ input }) {
        const newMovie = {
            id: randomUUID(),
            ...input
        }

        movies.push(newMovie)
        return newMovie
    } 

    static async delete ( { id }) {
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if (movieIndex === -1 ) return false

        movies.splice(movieIndex, 1)
        return true 
    }

    static async update ( {id, input }) {
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if (movieIndex === -1 ) return false

        movies[movieIndex] = {
            ...movies[movieIndex],
            ...input
        }
        return movies[movieIndex]
    }
}

