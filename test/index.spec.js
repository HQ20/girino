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

    it("simple", () => {
        var arthur = 'person';
        expect(arthur).to.model;
    });

    describe('revert', () => {
        it("should revert", () => {
            expect(
                simpleToken.transfer(accounts[2], new BigNumber('1'), { from: accounts[0] })
            ).to.not.revert;
        });
        
        it("should not revert", () => {
            expect(
                simpleToken.transfer(accounts[2], new BigNumber('1'), { from: accounts[1] })
            ).to.revert;
        });
    });
});