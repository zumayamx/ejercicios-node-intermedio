import { createRequire } from 'node:module'
const require = createRequire(import.meta.url) /* meta.url es la url del archivo actual */

export const readJSON = (path) => require(path) /* Esto es para poder importar archivos json */
