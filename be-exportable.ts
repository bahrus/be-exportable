import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps} from './types';
import {register} from 'be-hive/register.js';



export class BeExportable extends BE<AllProps, Actions> implements Actions{

    async hydrate(self: AllProps){
        const {enhancedElement} = self;
        if(enhancedElement instanceof HTMLScriptElement){
            const {doScript} = await import('./doScript.js');
            await doScript(self, enhancedElement);
        }
     
    }

}

export interface BeExportable extends AllProps{}

const tagName = 'be-exportable';
const ifWantsToBe = 'exportable';
const upgrade = 'script';

const xe = new XE<AllProps, Actions>({
    config: {
        tagName,
        isEnh: true,
        propDefaults:{
            ...propDefaults,
            enabled: true,
            beOosoom: 'enabled',
            preferAttrForBareImports: true,
        },
        propInfo: {
            ...propInfo
        },
        actions: {
            hydrate: 'enabled'
        }
    },
    superclass: BeExportable   
});

register(ifWantsToBe, upgrade, tagName);