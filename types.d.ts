import {IBE} from 'be-enhanced/types.js';

export interface EndUserProps<Exports=any> extends IBE<HTMLScriptElement>{
    //guid?: string;
    //shareByID?: boolean;
    enabled?: boolean;
    beOosoom?: string;
}

export interface AllProps<Exports=any> extends EndUserProps<Exports>{
    exports?: Exports;
    
}


export interface Actions{
    hydrate(ap: AllProps): Promise<void>;
}


