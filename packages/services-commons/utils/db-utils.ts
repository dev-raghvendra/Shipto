import {v4 as uuid} from "uuid"

export function generateId<t,k extends keyof t>(model:k,map:t) {
        return `${map[model]}-${uuid()}`;
}