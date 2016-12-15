/**
 * Created by Zinway on 2016/12/9.
 */
import api from '../src/api'

describe('API测试', () => {
    it('api.search测试', () => {
        api.search("演员", data => {
            expect(data[0].name).toBe("演员")
        })
    })

    it('api.song测试', () => {
        api.song('32507038', data => {
            expect(data.songs[0].name).toBe('演员')
        })
    })

    it('api.lrc测试', () => {
        api.lrc('32507038', data => {
            expect(data.code).toBe(200)
        })
    })

    it('api.playLists测试', () => {
        api.playLists('1', data => {
            expect(data.code).toBe(200)
        })
    })

    it('api.artistAlbums测试', () => {
        api.artistAlbums('5781', data => {
            expect(data.code).toBe(200)
        })
    })

    it('api.albums测试', () => {
        api.albums('3154175', data => {
            expect(data.code).toBe(200)
        })
    })
});
