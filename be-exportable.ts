import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps} from './types';
import {register} from 'be-hive/register.js';

//TODO:  store in trully global place based on guid (symbol.for)
const sharedTags = new Map<string, AllProps>();

export class BeExportable extends BE<AllProps, Actions, HTMLScriptElement> implements Actions{

    async hydrate(self: AllProps){
        delete self.dataset.loaded;
        const {enhancedElement, preferAttrForBareImports} = self;
        let {id} = enhancedElement;
        if(!id){
            id = 'shared-' + crypto.randomUUID();
            enhancedElement.id = id;
        }
        if(id.startsWith('shared-')){
            if(sharedTags.has(id)){
                const sharedElement = sharedTags.get(id)! as BeExportable;
                await sharedElement.whenResolved();
                self.exports = sharedElement.exports;
                self.dispatchEvent(new Event('load'));
                self.dataset.loaded = 'true';
                self.resolved = true;
                sharedElement.innerHTML = '';
                return;
            }else{
                sharedTags.set(id, self);
            }
        }
        self.exports = {};
        let innerText: string | undefined;
        let src: string  | undefined;
        if(preferAttrForBareImports){
            const attr = enhancedElement.getAttribute('src');
            if(attr !== null && !attr.startsWith('.') && !attr.startsWith('/')){
                src = attr;
            }else {
                src = enhancedElement.src;
            }
        }else{
            src = enhancedElement.src;
        }
        
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