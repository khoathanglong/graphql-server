export const APP_SEC = "KDRAGON SMILE HAHA";
const jwt=require('jsonwebtoken');

export const getUserId = (context)=>{
    const Authorization = context.request.get('Authorization');
    if (Authorization){
        const token = Authorization.replace('Bearer ',"");
        const {userId}=jwt.verify(token,APP_SEC);
        return userId
    }
    throw new Error('Not authenticated')
}