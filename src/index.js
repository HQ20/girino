const BigNumber = require('bignumber.js');

module.exports = function (chai, utils) {
    var Assertion = chai.Assertion;

    utils.addMethod(Assertion.prototype, 'revert', function (revertReason) {
        const derivedPromise = this._obj.then(
            (value) => {
                this.assert(false,
                    'Expected to reverted',
                    'Expected NOT reverted');
                return value;
            },
            (reason) => {
                const reasonMessage = reason.toString().match(/Reason given: (.*)\./)[1];
                if (revertReason.length > 0) {
                    this.assert(
                        reasonMessage === revertReason,
                        "expected #{exp} but found #{act}",
                        "expected #{exp} but was not found",
                        revertReason,
                        reasonMessage
                    );
                }
                return reason;
            }
        );
        this.then = derivedPromise.then.bind(derivedPromise);
        this.catch = derivedPromise.catch.bind(derivedPromise);
        return this;
    });

    utils.addMethod(Assertion.prototype, 'emit', function (eventName) {
        const transactionLogs = this._obj.logs;
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
    });

    utils.addMethod(Assertion.prototype, 'withArgs', function (...args) {
        const transactionLogs = this._obj.logs;
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
    });
};