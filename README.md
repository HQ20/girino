# girino

Girino is a chai module to improve truffle test development.

## Installation

```bash
yarn add girino -D
# or
npm install girino --save-dev
```

## Usage

```javascript
const SimpleToken = artifacts.require('SimpleToken');
const BigNumber = require('bignumber.js');
const chai = require('chai');
const girino = require('girino');

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

    it('should not revert', () => expect(
        simpleToken.transfer(receiverAccount, aToken, { from: mainAccount }),
    ).to.not.revert);

    it('should not revertWith', () => expect(
        simpleToken.transfer(receiverAccount, aToken, { from: mainAccount }),
    ).to.not.revertWith('SafeMath: subtraction overflow'));

    it('to emit', () => expect(
        simpleToken.transfer(receiverAccount, aToken, { from: mainAccount }),
    ).to.emit('Transfer'));

    it('withArgs success', () => expect(
        simpleToken.transfer(receiverAccount, aToken, { from: mainAccount }),
    ).to.emit('Transfer').withArgs(mainAccount, receiverAccount, aToken));
});

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPL-3.0-only](LICENSE)
