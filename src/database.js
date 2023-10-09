import moment from 'moment'
import fs from 'node:fs/promises'

const dataBasePath =  new URL('../database/db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(dataBasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist () {
        fs.writeFile(dataBasePath, JSON.stringify(this.#database))
    }

    insert (table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    select (table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].includes(value)
                })
            })
        }

        return data
    }

    update (table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table][rowIndex].title = data.title !== '' || data.title !== null ? data.title : this.#database[table][rowIndex].title
            this.#database[table][rowIndex].description = data.description !== '' || data.description !== null ? data.title : this.#database[table][rowIndex].description
            this.#database[table][rowIndex].updated_at = data.updated_at !== '' || data.updated_at !== null ? data.updated_at : this.#database[table][rowIndex].updated_at
            this.#persist()
        }
    }

    delete (table, id) {
        const rowIndex =  this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    setComplete(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            if(this.#database[table][rowIndex].completed_at === null) {
                this.#database[table][rowIndex].completed_at = data.completed_at
            } else {
                this.#database[table][rowIndex].completed_at = null
            }
            this.#persist()
        }
    }
}
