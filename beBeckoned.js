export function beBeckoned({ container, id }, callback) {
    const query = id ? '#' + id : 'script[is-exportable],script[data-is-exportable]';
    const match = container.querySelector(query);
    if (match !== null) {
        if (match._modExport) {
            callback({ ...match._modExport });
            return;
        }
        match.addEventListener('load', e => {
            callback({ ...match._modExport });
        }, { once: true });
        return;
    }
    const controller = new AbortController();
    container.addEventListener('load', e => {
        const target = e.target;
        if (target.matches(query)) {
            callback({ ...target._modExport });
            controller.abort();
        }
    }, { capture: true, signal: controller.signal });
}
