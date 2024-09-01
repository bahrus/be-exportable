// @ts-check

/**
 * 
 * @param {string} key 
 * @param {string} innerText 
 * @param {string} keyword 
 */
function getModifiedText(key, innerText, keyword){
    const splitTerm = `export ${keyword}`;
    const splitText = innerText.split(splitTerm);
    const winKey = `window['${key}']`;
    for (let i = 1, ii = splitText.length; i < ii; i++) {
        const token = splitText[i];
        switch(keyword){
            case 'const': {
                const iPosOfEq = token.indexOf('=');
                const lhs = token.substr(0, iPosOfEq).trim();
                splitText[i] = `${keyword} ${lhs}  = ${winKey}.beEnhanced.beExportable.exports.${lhs} = ${token.substr(iPosOfEq + 1)};`;
                break;
            }

            case 'class': {
                debugger;
                const iPosOfOpenBrace = token.indexOf('{');
                const lhs = token.substr(0, iPosOfOpenBrace).trim();
                splitText[i] = `${winKey}.beEnhanced.beExportable.exports.${lhs} = ${keyword} ${lhs} {
                    ${token.substr(iPosOfOpenBrace + 1)
                }`;
                break;
            }


        }

    }
    return splitText.join('');
}
export async function doInline(target) {
    const key = crypto.randomUUID();
    window[key] = target;
    let innerText = target.innerText;
    innerText = innerText.replaceAll('selfish', `window['${key}']`);
    let modifiedText = getModifiedText(key, innerText, 'const');
    modifiedText = getModifiedText(key, modifiedText, 'class');
    modifiedText = /* js */ `
${modifiedText}
window['${key}'].dispatchEvent(new Event('load'));
window['${key}'].dataset.loaded = 'true';
window['${key}'].beEnhanced.beExportable.resolved=true;
`;
    const scriptTag = document.createElement('script');
    scriptTag.type = 'module';
    scriptTag.innerHTML = modifiedText;
    if (target.id.startsWith('shared-')) {
        target.innerHTML = '';
    }
    document.head.appendChild(scriptTag);
}
