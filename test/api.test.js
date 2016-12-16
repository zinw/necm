/**
 * Created by Zinway on 2016/12/9.
 */
import api from '../src/api'

describe('API测试', () => {
    it('api.search测试', async () => {
        let d = await api.search("演员")
        expect(d[0].name).toBe('演员')
    })

    it('api.song测试', async () => {
        let d = await api.song('32507038')
        expect(d[0].name).toBe('演员')
    })

    it('api.lrc测试', async () => {
        let d = await api.lrc('32507038')
        expect(d).not.toBeNull()
    })

    it('api.playLists测试',async () => {
        let d = await api.playLists('1')
        expect(d.id).toBe(1)
    })

    it('api.artistAlbums测试', async () => {
        let d = await api.artistAlbums('5781')
        expect(d.artist.name).toBe('薛之谦')
    })

    it('api.albums测试', async () => {
        let d = await api.albums('3154175')
        expect(d.name).toBe('绅士')
    })
});
