import {BeExportable} from './be-exportable.js';
import {def} from 'trans-render/lib/def.js';

await BeExportable.bootUp();

def('be-exportable', BeExportable);