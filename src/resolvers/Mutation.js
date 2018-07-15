const jwt=require ('jsonwebtoken');
const bcrypt=require('bcryptjs');
import {APP_SEC, getUserId} from '../utils.js';


async function signup (parents, args, context, info ){
    // const user = await context.db.query.user({where:{email:args.email}},`{email id}`);
    // console.log('user, user')
    // if (user) {
    //     throw new Error(`user ${email} already register, please choose another one`)
    // }else{
        const password = await bcrypt.hash(args.password,10); //hass password received
        const newUser= await context.db.mutation.createUser({
            data:{...args, password}
        },`{id}`);
        const token = jwt.sign({userId: newUser.id},APP_SEC);
        return {token, user:newUser}
    // }
}

async function login (parents, args, context, info){
    const user =await context.db.query.user({
        where: { email:args.email}
    }, `{id password}`);

    if (!user){
        throw new Error(`No such user found`)
    };

    const valid= await bcrypt.compare(args.password,user.password);
    if(!valid){
        throw new Error(`invalid password`)
    };
    
    const token = jwt.sign({userId:newUser.id},APP_SEC);

    return {token, user}
}

const post = (parents,args,context, info)=>{
    const userId = getUserId(context);
    return context.db.mutation.createLink({
        data:{
            url:args.url,
            description:args.description,
            postedBy:{connect:{id:userId}}
        }
    },info)
}

async function vote(parent, args, context, info) {
    // 1
    const userId = getUserId(context)
  
    // 2
    const linkExists = await context.db.exists.Vote({
      user: { id: userId },
      link: { id: args.linkId },
    })
    if (linkExists) {
      throw new Error(`Already voted for link: ${args.linkId}`)
    }
  
    // 3
    return context.db.mutation.createVote(
      {
        data: {
          user: { connect: { id: userId } },
          link: { connect: { id: args.linkId } },
        },
      },
      info,
    )
}

module.exports={
    post,
    login,
    signup,
    vote
}