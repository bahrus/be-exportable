import {BeDecoratedProps} from 'be-decorated/types';

export interface BeExportableVirtualProps{

}

export interface BeExportableProps extends BeExportableVirtualProps{
    proxy: HTMLScriptElement & BeExportableVirtualProps;
}

export interface BeExportableActions{
    intro(proxy: HTMLScriptElement & BeExportableVirtualProps, target: HTMLScriptElement, beDecorProps: BeDecoratedProps): void;
}
