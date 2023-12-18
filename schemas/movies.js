const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'El título debe ser un texto',
        required_error: 'El título es requerido'
    }),
    year: z.number().int().positive().min(1888).max(2077),
    director: z.string(),
    duration: z.number().int().positive(), /* Hay que tener en cuenta que zod tiene demasidadas validaciones que podemos utilizar */
    rate: z.number().min(0).max(10),
    poster: z.string().url({
        message: 'El poster debe ser una URL válida'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Sci-Fi']),
        {
            required_error: 'El género es requerido',
            invalid_type_error: 'El género debe ser un arreglo de strings'
        }
    ) /* Tener en cuenta que la id no se valida, por lo cual si se quisiera actualizar no habria permiso (ignora la id)*/
})

function validateMovie (object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie (object) {
    return movieSchema.partial().safeParse(object)
}
module.exports = { 
    validateMovie,
    validatePartialMovie
 }