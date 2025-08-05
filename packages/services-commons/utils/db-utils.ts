import {v7 as uuid} from "uuid"

export function generateId<t,k extends keyof t>(model:k,map:t) {
        return `${map[model]}-${uuid()}`;
}

export function convertDatesToISO(this:Record<string,any> | Array<Record<string,any>>){
   if(this instanceof Array){
     if(typeof this[0] === "object"){
      this.forEach((el)=>{
        for(const key in el){
            if(el[key] instanceof Date){
              el[key] = el[key].toISOString()   
            }
        }
     })
     }
   }
   else if(this !instanceof Array && typeof this === "object"){
       for (const key in this ){
        if(this[key] instanceof Date){
            this[key] = this[key].toISOString() 
        }
    }
   }
}