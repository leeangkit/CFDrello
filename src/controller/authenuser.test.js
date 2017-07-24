import { createnewUser, checkreq } from './authenuser'
import MockAuthens from 'authens';

const AuthenUsers = new MockAuthens();
// jest.mock('../models/authenuser', () => {
//     return { AuthenUsers }
// });

test('checkreq have token,idUser,username', () => {
    expect(checkreq({
        "idUser": "1",
        "username": "xxxxx",
        "token": "12345678"
    })).toBe(false);
});

test('checkreq have token', () => {
    expect(checkreq({
        "token": "12345678"
    })).toBe(true);
});

test('checkreq have idUser', () => {
    expect(checkreq({
        "idUser": "1"
    })).toBe(true);
});

test('checkreq have username', () => {
    expect(checkreq({
        "username": "xxxxx"
    })).toBe(true);
});

test('checkreq have token,idUser', () => {
    expect(checkreq({
        "idUser": "1",
        "token": "12345678"
    })).toBe(true);
});

test('checkreq have token,username', () => {
    expect(checkreq({
        "username": "xxxxx",
        "token": "12345678"
    })).toBe(true);
});

test('checkreq have idUser,username', () => {
    expect(checkreq({
        "idUser": "1",
        "username": "xxxxx"
    })).toBe(true);
});

test('checkreq don\'t have idUser,username', () => {
    expect(checkreq({})).toBe(true);
});

test('create new user', async () => {
    const givenUser = {
        idUser: "",
        username: "",
        fullname: "",
        token: ""
    }
    const rec = await createnewUser(givenUser)
    expect(rec).toBe(true)
});

test('old user', async () => {
    const givenUser = {
        idUser: "1",
        username: "xxxxx",
        fullname: "xxxx xxxxx",
        token: "12345678"
    }
    const rec = await createnewUser(givenUser)
    expect(rec).toBe(false)
});



