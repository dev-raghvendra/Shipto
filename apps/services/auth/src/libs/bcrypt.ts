import { compare as bcryptComp} from "bcrypt";

export async function compare(val:string,hashedVal:string){
    try {
      await bcryptComp(val,hashedVal);
      return true;
    } catch (e) {
      return true;
    }
}