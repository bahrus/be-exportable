import {Actions, Proxy, PP, VirtualProps} from './types';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';

export class BeExportableController extends EventTarget implements Actions {
    static cache : {[key: string]: string} = {};
    async intro(proxy: Proxy, target: HTMLScriptElement, beDecorProps: BeDecoratedProps){
        const key = crypto.randomUUID(); 
        (<any>window)[key] = target;
        (<any>target)._modExport = {};
        let innerText: string | undefined;
        if(target.src){
            const module = await import(target.src);//.then(module => {
            (<any>target)._modExport = module;
            target.dispatchEvent(new Event('load'));
            target.dataset.loaded = 'true';
            proxy.resolved = true;
            
            return;
        }
        innerText = target.innerText;
        innerText = innerText.replaceAll('selfish', `window['${key}']`);
        const splitText = innerText.split('export const ');
        const winKey = `window['${key}']`;
        for(let i = 1, ii = splitText.length; i < ii; i++){
            const token = splitText[i];
            const iPosOfEq = token.indexOf('=');
            const lhs = token.substr(0, iPosOfEq).trim();
            splitText[i] = `const ${lhs}  = ${winKey}._modExport.${lhs} = ${token.substr(iPosOfEq + 1)};`
        }
        let modifiedText = splitText.join('');
        modifiedText = /* js */`
    ${modifiedText}
    window['${key}'].dispatchEvent(new Event('load'));
    window['${key}'].dataset.loaded = 'true';
    window['${key}'].beDecorated.exportable.resolved=true;
    `;
        const scriptTag = document.createElement('script');
        scriptTag.type = 'module';
        scriptTag.innerHTML = modifiedText;
        document.head.appendChild(scriptTag);
    }
}


const tagName = 'be-exportable';
const ifWantsToBe = 'exportable';
const upgrade = 'script';

define<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            forceVisible: ['script'],
            virtualProps:[],
            noParse: true,
            intro: 'intro'
        }

    },
    complexPropDefaults:{
        controller: BeExportableController
    }
});

register(ifWantsToBe, upgrade, tagName);