import { Members } from '../models/members' //as rename
import { checkCreateBoard } from './boards'

export const havedata = async (sendData) => {
    const inf = sendData
    console.log(inf)
    const callcheckreq = await checkreq(inf);
    console.log(callcheckreq)
    if (callcheckreq) 
        return res.status(500).send("format should be")

    const user = await Members.findOne({ id: inf.id });
    console.log(user)

    const callcreate = await createnewUser(user, inf);
    if (callcreate) {
        console.log("create new user complete");
    }
    else {
        console.log("have a user already!!");
    }
    const callBoards = await checkCreateBoard(inf)
}

export const checkreq = (inf) => {
    if (!inf.token || !inf.id || !inf.username || !inf.app_id || !inf.idBoards) {
        return true
    }
    else {
        return false
    }
}

export const createnewUser = async (user, body) => {
    if (!user) {
        const newuser = await Members.create({
            id: body.id,
            username: body.username,
            fullName: body.fullName,
            token: body.token,
            idBoards : body.idBoards
        })
        return true
    }
    else 
        return false
}