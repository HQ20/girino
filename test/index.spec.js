const SimpleToken = artifacts.require('SimpleToken');
const BigNumber = require('bignumber.js');
const chai = require('chai');
const girino = require('../src/index');

const { expect } = chai;

chai.use(girino);

contract('SimpleToken', (accounts) => {
    let simpleToken;
    const aToken = new BigNumber('1');
    const mainAccount = accounts[0];
    const receiverAccount = accounts[2];

    before(async () => {
        simpleToken = await SimpleToken.deployed();
    });

    describe('revert', () => {
        it('should not revert', () => expect(
            simpleToken.transfer(receiverAccount, aToken, { from: mainAccount }),
        ).to.not.revert);

        it('should revert', () => expect(
            simpleToken.transfer(receiverAccount, aToken, { from: accounts[1] }),
        ).to.revert);
    });

    describe('revertWith', () => {
        it('should not revertWith', () => expect(
            simpleToken.transfer(receiverAccount, aToken, { from: mainAccount }),
        ).to.not.revertWith('SafeMath: subtraction overflow'));

        it('should revertWith', () => expect(
            simpleToken.transfer(receiverAccount, aToken, { from: accounts[1] }),
        ).to.revertWith('ERC20: transfer amount exceeds balance'));

        it('should revertWith when using \'', () => expect(
            simpleToken.failQuote(),
        ).to.revertWith('This isn\'t a normal revert!'));
    });

    describe('emit', () => {
        it('to emit', () => expect(
            simpleToken.transfer(receiverAccount, aToken, { from: mainAccount }),
        ).to.emit('Transfer'));

        it('to not emit', () => expect(
            simpleToken.transfer(receiverAccount, aToken, { from: mainAccount }),
        ).to.not.emit('Approve'));
    });

    describe('withArgs', () => {
        it('withArgs success', () => expect(
            simpleToken.transfer(receiverAccount, aToken, { from: mainAccount }),
        ).to.emit('Transfer').withArgs(mainAccount, receiverAccount, aToken));

        it('withArgs no success', () => expect(
            simpleToken.transfer(receiverAccount, aToken, { from: mainAccount }),
        ).to.emit('Transfer').withArgs(mainAccount, receiverAccount, aToken));

        it('withArgs no success', async () => {
            let success = true;
            try {
                await expect(
                    simpleToken.transfer(receiverAccount, aToken, { from: mainAccount }),
                ).to.emit('Transfer').withArgs(accounts[3], receiverAccount, aToken);
                success = false;
            } catch (e) {
                //
            }
            return expect(success).to.be.true;
        });
    });

    describe('equal with big numbers', () => {
        it('equal with success', () => expect(
            simpleToken.returnNumber(),
        ).to.be.equal('5'));

        it('should throw when should not be equal', async () => {
            let err;
            try {
                await expect(
                    simpleToken.returnNumber(),
                ).to.not.be.equal('5');
            } catch (e) {
                err = e;
            } finally {
                expect(err.message).to.equal('expected \'5\' (BN) to not have been equal to \'5\' but instead got \'5\'');
            }
        });

        it('should throw when not equal', async () => {
            let err;
            try {
                await expect(
                    simpleToken.returnNumber(),
                ).to.be.equal('6');
            } catch (e) {
                err = e;
            } finally {
                expect(err.message).to.equal('expected \'5\' (BN) to be equal to \'6\' but instead got \'5\'');
            }
        });

        it('should work with existing equal', async () => {
            expect(6).to.be.equal(6);
        });
    });
});
