import './behance.js';
import { BeHive } from 'be-hive/be-hive.js';
BeHive.registry.register({
    base: 'be-exportable',
    enhPropKey: 'beExportable',
    map: {
        '0.0': 'ni'
    },
    do: {
        mount: {
            import: async () => {
                const { BeExportable } = await import('./be-exportable.js');
                return BeExportable;
            }
        }
    }
});
