module.exports = function (chai, utils) {
    var Assertion = chai.Assertion;

    utils.addProperty(Assertion.prototype, 'model', function () {
        this.assert(
            this._obj === 'person'
            , 'expected #{this} to be a Model'
            , 'expected #{this} to not be a Model'
        );
    });

    utils.addProperty(Assertion.prototype, 'revert', async function () {
        let exception;
        try {
            await this._obj;
        } catch(ex) {
            exception = ex;
        }
        this.assert(exception, 'Expected to revert!');
    });
};