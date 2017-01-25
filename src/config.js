/**
 * Created by Zinway on 2016/12/7.
 */
const origin = 'http://music.163.com';

const globalOption = {
    headers: {
        'Connection': 'keep-alive',
        'Origin': origin,
        'Referer': origin,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

const cookieFile = `${process.env.HOME}/.necmCookie.json`;

export {
    origin,
    globalOption,
    cookieFile,
}