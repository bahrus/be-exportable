import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {XE} from 'xtal-element/XE.js';
import {IBE} from 'be-enhanced/types.js';
import {Actions} from './types';
import {register} from 'be-hive/register.js';

export class BeExportable extends BE{
    override async attach(enhancedElement: Element, enhancement: string): Promise<void>{
        console.log({enhancement});
    }
}

const tagName = 'be-exportable';
const ifWantsToBe = 'exportable';
const upgrade = 'script';

const xe = new XE<IBE, Actions>({
    config: {
        tagName,
        propDefaults:{
            ...propDefaults
        },
        propInfo: {
            ...propInfo
        },
    },
    superclass: BeExportable   
});

register(ifWantsToBe, upgrade, tagName);