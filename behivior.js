// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
const base = 'be-exportable';
/** @import {EMC} from './ts-refs/trans-render/be/types.d.ts' */

/**
 * @type {EMC}
 */
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
