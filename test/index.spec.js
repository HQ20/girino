const SimpleToken = artifacts.require('SimpleToken');
const BigNumber = require('bignumber.js');
const chai = require('chai');
const chaiModel = require('../src/index');
const expect = chai.expect;

chai.use(chaiModel);


contract("SimpleToken", (accounts) => {
    let simpleToken;

    before(async () => {
        simpleToken = await SimpleToken.deployed();
    });

    describe('revert', () => {
        it("should not revert", async () => {
            await expect(
                simpleToken.transfer(accounts[2], new BigNumber('1'), { from: accounts[0] })
            ).to.not.revert();
        });

        it("should revert", async () => {
            await expect(
                simpleToken.transfer(accounts[2], new BigNumber('1'), { from: accounts[1] })
            ).to.revert('SafeMath: subtraction overflow');
        });
    });

    describe('emit', () => {
        it("to emit", async () => {
            expect(
                await simpleToken.transfer(accounts[2], new BigNumber('1'), { from: accounts[0] })
            ).to.emit('Transfer');
        });

        it("to not emit", async () => {
            expect(
                await simpleToken.transfer(accounts[2], new BigNumber('1'), { from: accounts[0] })
            ).to.not.emit('Approve');
        });
    });

    describe('withArgs', () => {
        it("withArgs success", async () => {
            expect(
                await simpleToken.transfer(accounts[2], new BigNumber('1'), { from: accounts[0] })
            ).to.emit('Transfer').withArgs(accounts[0], accounts[2], new BigNumber('1'))
        });
    });
});