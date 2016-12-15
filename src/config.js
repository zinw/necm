/**
 * Created by Zinway on 2016/12/7.
 */
const origin = 'http://music.163.com';

const globalOption = {
    headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip,deflate,sdch',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'music.163.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2951.0 Safari/537.36'
    },
    proxy: false
};

export {origin, globalOption}