declare global {
    export namespace Chai {
        // tslint:disable-next-line: interface-name
        interface Assertion {
            revert: Promise<void>;
            revertWith(expectedText: string): Promise<void>;
            emit(event: string): Promise<void>;
            withArgs(args: any): Promise<void>;
        }
    }
}

export = function chaiGirino(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
    const { Assertion } = chai;

    // eslint-disable-next-line func-names
    utils.addProperty(Assertion.prototype, 'revert', function(this: any) {
        // eslint-disable-next-line no-underscore-dangle
        const txPromise = this._obj.then(
            (value: any) => {
                this.assert(false,
                    'Expected to reverted',
                    'Expected NOT reverted');
                return value;
            },
            (reason: any) => {
                const revertMessage = reason.toString().search('revert');
                const throwMessage = reason.toString().search('invalid opcode');
                this.assert(
                    revertMessage >= 0 || throwMessage >= 0,
                    `Something happened: ${reason}`,
                    'Expected NOT reverted',
                    'Reverted',
                    reason,
                );
                return reason;
            },
        );
        this.then = txPromise.then.bind(txPromise);
        this.catch = txPromise.catch.bind(txPromise);
        return this;
    });

    // eslint-disable-next-line func-names
    utils.addMethod(Assertion.prototype, 'revertWith', function(this: any, revertReason: string) {
        // eslint-disable-next-line no-underscore-dangle
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

    // eslint-disable-next-line func-names
    utils.addMethod(Assertion.prototype, 'emit', function(this: any, eventName: string) {
        // eslint-disable-next-line no-underscore-dangle
        const txPromise = this._obj.then(
            (value: any) => {
                const transactionLogs = value.logs;
                const totalLogs = transactionLogs.length;
                let success = false;
                for (let x = 0; x < totalLogs; x += 1) {
                    if (transactionLogs[x].event === eventName) {
                        success = true;
                        break;
                    }
                }
                this.assert(
                    success,
                    'expected #{this} to find #{exp}',
                    'expected #{this} to not find #{exp}',
                    eventName,
                );
                return value;
            },
        );
        this.then = txPromise.then.bind(txPromise);
        return this;
    });

    // eslint-disable-next-line func-names
    utils.addMethod(Assertion.prototype, 'withArgs', function(this: any, ...args: any) {
        // eslint-disable-next-line no-underscore-dangle
        const txPromise = this._obj.then(
            (value: any) => {
                const transactionLogs = value.logs;
                const totalLogs = transactionLogs.length;
                const tArgs = args.length;
                let success = false;
                let fullLogs = '';
                let toCompare;
                for (let x = 0; x < totalLogs; x += 1) {
                    toCompare = transactionLogs[x].args[0].toString();
                    for (let y = 1; y < tArgs; y += 1) {
                        toCompare += `,${transactionLogs[x].args[y].toString()}`;
                    }
                    fullLogs += toCompare;
                    if (toCompare === args.toString()) {
                        success = true;
                        break;
                    }
                }
                this.assert(
                    success,
                    'One or more logs were found, but none corresponds to the expected!',
                    'One of the logs correspond to the not expected one!',
                    args.toString(),
                    fullLogs,
                );
                return value;
            },
        );
        this.then = txPromise.then.bind(txPromise);
        return this;
    });

    // tslint:disable-next-line: variable-name
    utils.overwriteMethod(Assertion.prototype, 'equal', function(this: any, _super: any) {
        // eslint-disable-next-line consistent-return
        return function assertEqualBN(this: any, n: any) {
            // eslint-disable-next-line no-underscore-dangle
            if (this._obj.constructor.name === 'Promise') {
                // eslint-disable-next-line no-underscore-dangle
                const txPromise = this._obj.then((resultValueBN: any) => {
                    if (resultValueBN.constructor.name === 'BN') {
                        const value = resultValueBN.toString();
                        this.assert(
                            value === n,
                            `expected '${value}' (BN) to be equal to #{exp} but instead got #{act}`,
                            `expected '${value}' (BN) to not have been equal to #{exp} but instead got #{act}`,
                            n,
                            value,
                        );
                    }
                });
                this.then = txPromise.then.bind(txPromise);
                return this;
            }
            // eslint-disable-next-line prefer-rest-params
            _super.apply(this, arguments);
        };
    });
};
