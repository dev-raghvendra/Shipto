import {v4 as uuid} from "uuid"

export function generateId<t,k extends keyof t>(model:k,map:t) {
        return `${map[model]}-${uuid()}`;
}

export function convertDatesToISO(this:Record<string,any>){
    for (const key in this ){
        if(this[key] instanceof Date){
            this[key] = this[key].toISOString() 
        }
    }
}