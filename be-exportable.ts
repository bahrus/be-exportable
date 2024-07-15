import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, PAP} from './types';
import {MountObserver} from 'mount-observer/MountObserver.js';
import {IEnhancement,  BEAllProps, EnhancementInfo, EMC} from 'trans-render/be/types';

//TODO:  store in truly global place based on guid (symbol.for)
const sharedTags = new Map<string, AllProps>();

class BeExportable extends BE<any, any, HTMLScriptElement> implements Actions{
    static override config: BEConfig<AllProps & BEAllProps, Actions & IEnhancement, any> = {
        propInfo: {
            ...(beCnfg.propInfo),
            attached:{
                def: true,
                ro: true,
            }
        },
        actions:{
            hydrate:{
                ifAllOf: ['attached']
            }
        },
        positractions: [...(beCnfg.positractions!)]
    };
    #emc: EMC | undefined;
    override async attach(el: HTMLScriptElement, enhancementInfo: EnhancementInfo) {
        const {mountCnfg} = enhancementInfo;
        this.#emc = mountCnfg;
        await super.attach(el, enhancementInfo);
    }
    
    async hydrate(self: AllProps & EventTarget) : Promise<Partial<AllProps>>{
        const {enhancedElement, preferAttrForBareImports} = self;
        if(enhancedElement.hasAttribute('blow-dry') || enhancedElement.dataset.blowDry){
            //TODO move this to external file
            const {BlowDry} = await import('blow-dry/blow-dry.js');
            //double check again due to yielding the thread
            if(enhancedElement.hasAttribute('blow-dry') || enhancedElement.dataset.blowDry){
                const bd = new BlowDry();
                bd.blowDryScriptElement(enhancedElement);
            }
        }
        const scriptRef = enhancedElement.dataset.blowDryScriptRef;
        if(scriptRef){
            const ref = (<any>document.head)[scriptRef];
            if(ref instanceof HTMLScriptElement){
                //already taken care of, but need to wait for it to be loaded
                const exports = (<any>ref).beEnhanced[this.#emc!.enhPropKey].exports;
                if(exports){
                    self.exports = exports; 
                    return {
                        resolved: true,
                    }
                }else{
                    const enhancement = await (<any>ref).beEnhanced.whenResolved(this.#emc);
                    self.exports = enhancement.exports;
                    return {
                        resolved: true,
                    }
                }
            }else{
                const sharedScriptElement = document.createElement('script');
                sharedScriptElement.noModule = true;
                (<any>document.head)[scriptRef] = sharedScriptElement;
                if(Array.isArray(ref)){
                    //array is of a url
                    sharedScriptElement.src = ref[0];
                }else{
                    sharedScriptElement.innerHTML = ref;
                }
                document.head.appendChild(sharedScriptElement);
                const enhancement = await (<any>sharedScriptElement).beEnhanced.whenResolved(this.#emc);
                self.exports = enhancement.exports;
                return {
                    resolved: true,
                }
            }
        }
        delete enhancedElement.dataset.loaded;
        let {id} = enhancedElement;
        if(!id){
            id = 'shared-' + crypto.randomUUID();
            enhancedElement.id = id;
        }
        if(id.startsWith('shared-')){
            if(sharedTags.has(id)){
                const sharedElement = sharedTags.get(id)! as AllProps & HTMLScriptElement;
                await sharedElement.whenResolved();
                self.exports = sharedElement.exports;
                self.dispatchEvent(new Event('load'));
                enhancedElement.dataset.loaded = 'true';
                sharedElement.innerHTML = '';
                return {
                    resolved: true
                } as PAP;
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
            enhancedElement.dataset.loaded = 'true';
            return {
                resolved: true
            } as PAP
        }else{
            const {doInline} = await import('./doInline.js');
            await doInline(enhancedElement);
            //the script itself does the resolving
            //self.resolved = true;
        }  
        return {
            //resolved: true
        } as PAP    
    }
}

interface BeExportable extends AllProps{}

await BeExportable.bootUp();

export {BeExportable}