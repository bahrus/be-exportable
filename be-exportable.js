import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
const cache = {};
export class BeExportableController {
    static cache = {};
    async intro(proxy, target, beDecorProps) {
        const key = (new Date()).valueOf().toString() + Math.random(); //TODO:  use crypto
        window[key] = target;
        target._modExport = {};
        let innerText;
        if (target.src) {
            if (cache[target.src] === undefined) {
                const resp = await fetch(target.src);
                const text = await resp.text();
                cache[target.src] = text;
            }
            innerText = cache[target.src];
        }
        else {
            innerText = target.innerText;
        }
        innerText = innerText.replaceAll('selfish', `window['${key}']`);
        const splitText = innerText.split('export const ');
        //let iPos = 0;
        const winKey = `window['${key}']`;
        for (let i = 1, ii = splitText.length; i < ii; i++) {
            const token = splitText[i];
            const iPosOfEq = token.indexOf('=');
            const lhs = token.substr(0, iPosOfEq).trim();
            splitText[i] = `const ${lhs}  = ${winKey}._modExport.${lhs} = ${token.substr(iPosOfEq + 1)};`;
        }
        let modifiedText = splitText.join('');
        modifiedText = /* js */ `
    try{
        ${modifiedText}
    }catch(err){
        window['${key}'].dispatchEvent(new CustomEvent('err', {
            detail: {
                message: err
            }
        }))
    }
    window['${key}'].dispatchEvent(new Event('loaded'));
    window['${key}'].dataset.loaded = 'true';
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
define({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            forceVisible: ['script'],
            virtualProps: [],
            noParse: true,
            intro: 'intro'
        }
    },
    complexPropDefaults: {
        controller: BeExportableController
    }
});
register(ifWantsToBe, upgrade, tagName);
