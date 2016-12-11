/**
 * Created by Zinway on 2016/12/7.
 */
const origin = 'http://music.163.com';

const globalOption = {
    headers: {
        'Origin': origin,
        'Referer': origin,
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    proxy: false
};

export {origin, globalOption}