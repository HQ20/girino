/// <reference types="chai" />
declare global {
    export namespace Chai {
        interface Assertion {
            responseText(expectedText: string | RegExp): Promise<void>;
        }
    }
}
declare const _default: (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) => void;
export = _default;
