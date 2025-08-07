import {v7 as uuid} from "uuid"

export function generateId<t,k extends keyof t>(model:k,map:t) {
        return `${map[model]}-${uuid()}`;
}

export function convertDatesToISO(this: Record<string, any> | Array<Record<string, any>>): void {
  const traverse = (value: any): void => {
    if (value instanceof Date) {
      return;
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] instanceof Date) {
          value[i] = value[i].toISOString();
        } else if (typeof value[i] === 'object' && value[i] !== null) {
          traverse(value[i]);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (!Object.prototype.hasOwnProperty.call(value, key)) continue;

        const val = value[key];
        if (val instanceof Date) {
          value[key] = val.toISOString();
        } else if (typeof val === 'object' && val !== null) {
          traverse(val);
        }
      }
    }
  };

  traverse(this);
}
