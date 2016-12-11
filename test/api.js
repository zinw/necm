/**
 * Created by Zinway on 2016/12/9.
 */
import NECM from '../libs/necm'

const necm = new NECM();

necm.api.search('演员', data => {
    console.log(data);
});
