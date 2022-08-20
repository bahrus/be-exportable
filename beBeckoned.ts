import {beBeckonedFrom} from './types';
export function beBeckoned({container, id}: beBeckonedFrom, callback: (exports: any) => void){
    const query = id ? '#' + id : 'script[is-exportable],script[data-is-exportable]';
    const match = container.querySelector(query);
    if(match !== null){
        if((match as any)._modExport){
            callback({...(match as any)._modExport});
            return;
        }
        match.addEventListener('load', e =>{
            callback({...(match as any)._modExport});
        }, {once: true});
        return;
    }
    const controller = new AbortController();

    container.addEventListener('load', e => {
        const target = e.target as Element;
        if(target.matches(query)){
            callback({...(target as any)._modExport});
            controller.abort();
        }
    }, {capture: true, signal: controller.signal});
    
}

