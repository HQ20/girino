declare global {
    export namespace Chai {
        // tslint:disable-next-line: interface-name
        interface Assertion {
            responseText(expectedText: string | RegExp): Promise<void>;
            revertWith(expectedText: string | RegExp): Promise<void>;
        }
    }
}

export default function chaiGirino(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
    const { Assertion } = chai;

    Assertion.addMethod('responseText', async function(this: any, expectedText: string | RegExp) {
        //
    });

    utils.addMethod(Assertion.prototype, 'revertWith', function(this: any, revertReason: string | RegExp) {
        const txPromise = this._obj.then(
            (value: any) => {
                this.assert(false,
                    'Expected to reverted',
                    'Expected NOT reverted');
                return value;
            },
            (reason: any) => {
                let reasonComplete = reason.toString().match(/Reason given: ([a-zA-Z0-9 .!:']*)\./);
                let reasonMessage;
                if (reasonComplete === null) {
                    reasonComplete = reason.toString()
                        .match(/VM Exception while processing transaction: revert ([a-zA-Z0-9 .!:']*)/);
                }
                if (reasonComplete !== null) {
                    // eslint-disable-next-line prefer-destructuring
                    reasonMessage = reasonComplete[1];
                    this.assert(
                        reasonMessage === revertReason,
                        'expected #{exp} but found #{act}',
                        'expected to not find #{exp} but was found',
                        revertReason,
                        reasonMessage,
                    );
                }
                return reason;
            },
        );
        this.then = txPromise.then.bind(txPromise);
        this.catch = txPromise.catch.bind(txPromise);
        return this;
    });
}
