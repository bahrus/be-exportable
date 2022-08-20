export function importFromScriptRef(shadowDOMPeerCitizen, id) {
    return new Promise((resolve, reject) => {
        const query = '#' + id;
        const container = shadowDOMPeerCitizen.getRootNode();
        const match = container.querySelector(query);
        if (match !== null) {
            if (match._modExport) {
                resolve({ ...match._modExport });
            }
            else {
                match.addEventListener('load', e => {
                    resolve({ ...match._modExport });
                }, { once: true });
            }
        }
    });
}
