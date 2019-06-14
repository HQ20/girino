const BigNumber = require('bignumber.js');

module.exports = function (chai, utils) {
    var Assertion = chai.Assertion;

    utils.addProperty(Assertion.prototype, 'revert', function () {
        const txPromise = this._obj.then(
            (value) => {
                this.assert(false,
                    'Expected to reverted',
                    'Expected NOT reverted');
                return value;
            },
            (reason) => {
                const revertMessage = reason.toString().search('revert');
                const throwMessage = reason.toString().search('invalid opcode');
                this.assert(
                    revertMessage >= 0 || throwMessage >= 0,
                    'Something happened: ' + reason,
                    'Expected NOT reverted',
                    'Reverted',
                    reason
                );
                return reason;
            }
        );
        this.then = txPromise.then.bind(txPromise);
        this.catch = txPromise.catch.bind(txPromise);
        return this;
    });

    utils.addMethod(Assertion.prototype, 'revertWith', function (revertReason) {
        const txPromise = this._obj.then(
            (value) => {
                this.assert(false,
                    'Expected to reverted',
                    'Expected NOT reverted');
                return value;
            },
            (reason) => {
                const reasonMessage = reason.toString().match(/Reason given: (.*)\./)[1];
                this.assert(
                    reasonMessage === revertReason,
                    "expected #{exp} but found #{act}",
                    "expected to not find #{exp} but was found",
                    revertReason,
                    reasonMessage
                );
                return reason;
            }
        );
        this.then = txPromise.then.bind(txPromise);
        this.catch = txPromise.catch.bind(txPromise);
        return this;
    });

    utils.addMethod(Assertion.prototype, 'emit', function (eventName) {
        const txPromise = this._obj.then(
            (value) => {
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
                    "expected #{this} to find #{exp}",
                    "expected #{this} to not find #{exp}",
                    eventName
                );
                return value;
            }
        );
        this.then = txPromise.then.bind(txPromise);
        return this;
    });

    utils.addMethod(Assertion.prototype, 'withArgs', function (...args) {
        const txPromise = this._obj.then(
            (value) => {
                const transactionLogs = value.logs;
                const totalLogs = transactionLogs.length;
                let tArgs = args.length;
                let success = false;
                let sub = true;
                for (let x = 0; x < totalLogs; x += 1) {
                    sub = true;
                    for (let y = 0; y < tArgs; y += 1) {
                        if (args[y] instanceof BigNumber) {
                            if (!args[y].eq(transactionLogs[x].args[y].toString())) {
                                sub = false;
                                break;
                            }
                        } else {
                            if (transactionLogs[x].args[y] !== args[y]) {
                                sub = false;
                                break;
                            }
                        }
                    }
                    if (sub) {
                        success = true;
                        break;
                    }
                }
                this.assert(
                    success,
                    "expected #{this} to find #{exp}",
                    "expected #{this} to not find #{exp}",
                    args
                );
                return value;
            }
        );
        this.then = txPromise.then.bind(txPromise);
        return this;
    });
};