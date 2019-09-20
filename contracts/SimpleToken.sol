pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */
contract SimpleToken is ERC20, ERC20Detailed {

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () public ERC20Detailed("SimpleToken", "SIM", 18) {
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
    }

    /**
     * Method always reverting. Used to test revert with '
     */
    function failQuote() public view returns(bool) {
        require(false == true, "This isn't a normal revert!");
        return true;
    }

    /**
     * Method always retusn 5. Used to test BN comparison.
     */
    function returnNumber() public pure returns(uint256) {
        return 5;
    }
}
