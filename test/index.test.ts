import { BigNumber } from 'bignumber.js';
import { expect, use } from 'chai';
import girino from '../index';
import { SimpleTokenInstance } from '../types/truffle-contracts';

const SimpleToken = artifacts.require('./SimpleToken.sol') as Truffle.Contract<SimpleTokenInstance>;
use(girino);


contract('SimpleToken', (accounts) => {
    let simpleToken: SimpleTokenInstance;
    const aToken = new BigNumber('1');
    const mainAccount = accounts[0];
    const receiverAccount = accounts[2];

    before(async () => {
        simpleToken = await SimpleToken.deployed();
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
});
