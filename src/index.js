module.exports = function (chai, utils) {
    var Assertion = chai.Assertion;

    utils.addProperty(Assertion.prototype, 'revert', async function () {
        let exception;
        try {
            await this._obj;
        } catch (ex) {
            exception = ex;
        }
        this.assert(exception, 'Expected to revert!');
    });

    Assertion.addMethod('emit', function (eventName) {
        const transactionLogs = this._obj.logs;
        const totalLogs = transactionLogs.length;
        let success = false;
        for (let x = 0; x < totalLogs; x += 1) {
            if (transactionLogs[x].event === eventName) {
                success = true;
                break;
            }
        }
        this.assert(success, 'Should have!');
    });
};