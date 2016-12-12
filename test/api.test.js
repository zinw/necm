/**
 * Created by Zinway on 2016/12/9.
 */
import NECM from '../libs/necm'

const necm = new NECM();

necm.api.search('演员', data => {
    console.log("################Search API#################");
    console.log(data)
});

necm.api.song('32507038', data => {
    console.log("################Song API#################");
    console.log(data)
});

necm.api.lrc('32507038', data => {
    console.log("################Lrc API#################");
    console.log(data)
});

necm.api.artistAlbums('9952', data => {
    console.log('####################Artist Albums##############');
    console.log(data)
});

necm.api.albums('32311', data => {
    console.log("####################Albums####################");
    console.log(data)
});

necm.api.playLists('311785002', data => {
    console.log("####################Playlists####################");
    console.log(data)
});
