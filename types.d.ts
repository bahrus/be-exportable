import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';


export interface EndUserProps{
    //guid?: string;
    //shareByID?: boolean;
    enabled?: boolean;
    beOosoom?: string;
}

export interface VirtualProps extends EndUserProps, MinimalProxy<HTMLScriptElement>{

}

export type Proxy = HTMLScriptElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions{
    hydrate(pp: PP): void;
}

export interface ExportableScript<Exports=any> extends HTMLScriptElement{
    _modExport: Exports;
}

