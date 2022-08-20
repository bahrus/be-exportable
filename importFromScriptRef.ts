export function importFromScriptRef<TExports>(shadowDOMPeerCitizen: Element, id: string) : Promise<TExports> {
    return new Promise<TExports>((resolve, reject) =>{
        const query = '#' + id;
        const container = shadowDOMPeerCitizen.getRootNode() as Document | DocumentFragment;
        const match = container.querySelector(query);
        if(match !== null){
            if((match as any)._modExport){
                resolve({...(match as any)._modExport});
            }else{
                match.addEventListener('load', e =>{
                    resolve({...(match as any)._modExport});
                }, {once: true});
            }
        }
    });

    
}

