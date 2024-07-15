import {BlowDry} from 'blow-dry/blow-dry.js';
import {AllProps, PAP, ProPAP} from './types';
import { EMC } from 'be-hive/be-hive';

export async function blowDry(self: AllProps, emc: EMC): ProPAP{
    const {enhancedElement} = self;
    if(enhancedElement.hasAttribute('blow-dry') || enhancedElement.dataset.blowDry){
        const bd = new BlowDry();
        bd.blowDryScriptElement(enhancedElement);
    }
    const scriptRef = enhancedElement.dataset.blowDryScriptRef!;
    const ref = (<any>document.head)[scriptRef];
    if(ref instanceof HTMLScriptElement){
        //already taken care of, but need to wait for it to be loaded
        const exports = (<any>ref).beEnhanced[emc.enhPropKey].exports;
        if(exports){
            self.exports = exports; 
            return {
                resolved: true,
            }
        }else{
            const enhancement = await (<any>ref).beEnhanced.whenResolved(emc);
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
        const enhancement = await (<any>sharedScriptElement).beEnhanced.whenResolved(emc);
        self.exports = enhancement.exports;
        return {
            resolved: true,
        }
    }
}