declare global {
    export namespace Chai {
        interface Assertion {
            responseText(expectedText: string | RegExp): Promise<void>;
        }
    }
}

export = function chaiGirino(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
    const { Assertion } = chai;

    Assertion.addMethod('responseText', async function(this: any, expectedText: string | RegExp) {
        //
    });
};
