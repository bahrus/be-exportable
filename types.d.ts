import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';


export interface BeExportableEndUserProps{

}

export interface BeExportableVirtualProps extends BeExportableEndUserProps, MinimalProxy<HTMLScriptElement>{

}

export type Proxy = HTMLScriptElement & BeExportableVirtualProps;

export interface ProxyProps extends BeExportableVirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface BeExportableActions{
    intro(proxy: Proxy, target: HTMLScriptElement, beDecorProps: BeDecoratedProps): void;
}
