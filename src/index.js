// eslint-disable-next-line func-names
module.exports = function (chai, utils) {
    const { Assertion } = chai;

    // eslint-disable-next-line func-names
    utils.addProperty(Assertion.prototype, 'revert', function () {
        // eslint-disable-next-line no-underscore-dangle
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
    utils.addMethod(Assertion.prototype, 'revertWith', function (revertReason) {
        // eslint-disable-next-line no-underscore-dangle
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
                    'expected #{exp} but found #{act}',
                    'expected to not find #{exp} but was found',
                    revertReason,
                    reasonMessage,
                );
                return reason;
            },
        );
        this.then = txPromise.then.bind(txPromise);
        this.catch = txPromise.catch.bind(txPromise);
        return this;
    });

    // eslint-disable-next-line func-names
    utils.addMethod(Assertion.prototype, 'emit', function (eventName) {
        // eslint-disable-next-line no-underscore-dangle
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
    utils.addMethod(Assertion.prototype, 'withArgs', function (...args) {
        // eslint-disable-next-line no-underscore-dangle
        const txPromise = this._obj.then(
            (value) => {
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
};
