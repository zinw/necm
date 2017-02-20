/**
 * Created by Zinway on 2016/12/9.
 */
import api from '../src/api'

describe('API测试', () => {
    it('api.search测试', () => {
        let d = api.search('Victory')
        expect(d[0].name).toBe('Victory')
    })

    it('api.song测试', () => {
        let d = api.song('31654455')
        expect(d.name).toBe('Victory')
    })

    it('api.lrc测试', () => {
        let d = api.lrc(31654455)
        expect(d).not.toBeNull()
    })

    it('api.playList测试', () => {
        let d = api.playList('1')
        expect(d.id).toBe(1)
    })

    it('api.artistAlbums测试', () => {
        let d = api.artistAlbums('5781')
        expect(d.artist.name).toBe('薛之谦')
    })

    it('api.albums测试', () => {
        let d = api.albums('3154175')
        expect(d.name).toBe('绅士')
    })
});
