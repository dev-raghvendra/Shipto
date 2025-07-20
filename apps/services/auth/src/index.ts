import { PrismaClient } from "@prisma/client";

const client = new PrismaClient()
// client.user.create({
//     data:{
//         name:"Raghvendra Misra",
//         email:"itsraghav12@gmail.com"
//     }
// }).then((res)=>{
//     console.log(res)
// })


client.user.findFirst({
    select:{
        id:true,
        email:true,
        name:true
    },
    where:{
        id:{
            not:""
        }
    }
}).then((res)=>{
    console.log(res)
})