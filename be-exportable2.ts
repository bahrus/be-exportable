import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';

import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps} from './types';
import {register} from 'be-hive/register.js';

const cache : {[key: string]: string} = {};
const sharedTags = new Map<string, AllProps>();

export class BeExportable extends BE<AllProps, Actions, HTMLScriptElement> implements Actions{

    async hydrate(self: AllProps){
        delete self.dataset.loaded;
        const {enhancedElement} = self;
        const {id} = enhancedElement;
        if(id.startsWith('shared-')){
            throw 'NI';
            // if(sharedTags.has(id)){
            //     const sharedElement = sharedTags.get(self.id)! as BeExportable;
            //     self.exports = sharedElement.exports;
            //     if(sharedElement.dataset.loaded === 'true'){
            //         self.dispatchEvent(new Event('load'));
            //         self.dataset.loaded = 'true';
            //         self.resolved = true;
            //         return;
            //     }
            //     sharedElement.addEventListener('load', e=> {
            //         self.dispatchEvent(new Event('load'));
            //         self.dataset.loaded = 'true';
            //         self.resolved = true;
            //         return;
            //     });
            //     return;
            // }else{
            //     sharedTags.set(self.id, self);
            // }
        }
        self.exports = {};
        let innerText: string | undefined;
        const {src} = enhancedElement;
        if(src){
            const module = await import(src);//.then(module => {
            self.exports = module;
            self.dispatchEvent(new Event('load'));
            self.dataset.loaded = 'true';
            self.resolved = true;
            return;
        }else{
            const {doInline} = await import('./doInline.js');
            doInline(enhancedElement);
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
        propDefaults:{
            ...propDefaults,
            enabled: true,
            beOosoom: 'enabled',
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