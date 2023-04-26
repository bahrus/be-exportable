export async function doInline(target) {
    const key = crypto.randomUUID();
    window[key] = target;
    let innerText = target.innerText;
    innerText = innerText.replaceAll('selfish', `window['${key}']`);
    const splitText = innerText.split('export const ');
    const winKey = `window['${key}']`;
    for (let i = 1, ii = splitText.length; i < ii; i++) {
        const token = splitText[i];
        const iPosOfEq = token.indexOf('=');
        const lhs = token.substr(0, iPosOfEq).trim();
        splitText[i] = `const ${lhs}  = ${winKey}.beEnhanced.beExportable.exports.${lhs} = ${token.substr(iPosOfEq + 1)};`;
    }
    let modifiedText = splitText.join('');
    modifiedText = /* js */ `
${modifiedText}
window['${key}'].dispatchEvent(new Event('load'));
window['${key}'].dataset.loaded = 'true';
window['${key}'].beEnhanced.beExportable.resolved=true;
`;
    const scriptTag = document.createElement('script');
    scriptTag.type = 'module';
    scriptTag.innerHTML = modifiedText;
    document.head.appendChild(scriptTag);
}
