import { buildRoutePath } from './utils/built-route-paths.js'
import { Database } from './database.js'
import moment from 'moment'
import { randomUUID } from 'node:crypto'


const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {            
            const tasks  = database.select('tasks', null)
            return response.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            const { title, description } = request.body

            if (title && description) {
                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    updated_at: null,
                    created_at: moment().format(),
                    updated_at: moment().format(),
                    completed_at: null,
    
                }
                database.insert('tasks', task)
            }

            

            return response.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const { title, description } = request.body
            const { id } = request.params
            database.update('tasks', id, {
                title,
                description,
                updated_at: moment().format()
            })
            return response.writeHead(202).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/completed'),
        handler: (request, response) => {
            const { id } = request.params
            database.setComplete('tasks', id, {
                updated_at: moment().format(),
                completed_at: moment().format()
            })
            return response.writeHead(202).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params
            database.delete('tasks', id)
            return response.writeHead(204).end()
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            return response.end('Export Tasks')
        }
    },    
]
