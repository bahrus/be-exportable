import {BeHive, EMC, seed} from 'be-hive/be-hive.js';
import {MountObserver, MOSE} from 'mount-observer/MountObserver.js';

const base = 'be-exportable';
export const emc: EMC = {
    base,
    // map: {
    //     '0.0': 'ni'
    // },
    enhPropKey: 'beExportable',
    importEnh: async () => {
        const {BeExportable} = await import('./behance.js');
        return BeExportable;
    }
};
const mose = seed(emc);

MountObserver.synthesize(document, BeHive, mose);

