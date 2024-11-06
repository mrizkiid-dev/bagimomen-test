import api from "./api"
import type { TTodoGetParams, TTodoPatchPayload, TTodoPostPayload, TTodoResponseGet } from "./types/todo";
class TodoService {
    moduleName: string
    constructor(modulName: string) {
        this.moduleName = modulName;
    }
    get(id: number) {
        return api(this.moduleName+ '/' + id,{
            method: 'GET'
        })
    }

    getAll(params: TTodoGetParams) {
        let url = this.moduleName
        if(params.limit && params.limit > 0) {
            url = url + '?limit=' + params.limit
        }

        if(params.skip && params.skip > 0) {
            url = url + '&skip=' + params.skip
        }

        return api<TTodoResponseGet>(url,{
            method: 'GET'
        })
    }

    post(body: TTodoPostPayload) {
        return api(this.moduleName + '/add',{
            method: 'POST',
            body: JSON.stringify(body)
        })
    }

    patch(id: number | string,body: TTodoPatchPayload) {
        return api(this.moduleName + '/' + id,{
            method: 'PATCH',
            body: JSON.stringify(body)
        })
    }

    delete(id: number) {
        return api(this.moduleName + '/' + id, {
            method: 'DELETE'
        })
    }
}

export default new TodoService('/todos')