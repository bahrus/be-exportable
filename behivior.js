import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
const base = 'be-exportable';
export const emc = {
    base,
    enhPropKey: 'beExportable',
    importEnh: async () => {
        const { BeExportable } = await import('./be-exportable.js');
        return BeExportable;
    }
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);
