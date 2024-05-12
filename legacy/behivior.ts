import {register} from 'be-hive/register.js';
import {tagName } from './be-exportable.js';
import './be-exportable.js';

const ifWantsToBe = 'exportable';
const upgrade = 'script';

register(ifWantsToBe, upgrade, tagName);