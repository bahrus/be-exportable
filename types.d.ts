import {IEnhancement, BEAllProps} from 'trans-render/be/types';

export interface EndUserProps<Exports=any> extends IEnhancement<HTMLScriptElement>{
    // //guid?: string;
    // //shareByID?: boolean;
    // enabled?: boolean;
    // beOosoom?: string;
    preferAttrForBareImports?: boolean;
    attached: boolean;
}

export interface AllProps<Exports=any> extends EndUserProps<Exports>{
    exports?: Exports;
    
}

export type PAP = Partial<AllProps>;

export type ProPAP = Promise<PAP>


export interface Actions{
    hydrate(ap: AllProps): Promise<PAP>;
}


