import {BeExportable} from './be-exportable.js';
import {AllProps} from './types';
//TODO:  store in trully global place based on guid (symbol.for)
const sharedTags = new Map<string, AllProps>();

export async function doScript(self: AllProps, enhancedElement: HTMLScriptElement){
    const {preferAttrForBareImports} = self;
    delete self.dataset.loaded;
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
        await doInline(enhancedElement);
        //self.resolved = true;
    }  
}