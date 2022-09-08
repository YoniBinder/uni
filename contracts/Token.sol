//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.16;

import "hardhat/console.sol";

contract Token {
    string public name = "My Token";
    string public symbol = "YB";

    uint256 public _totalSupply = 1000000;

    mapping(address => uint256) public balances;
    mapping(address => mapping (address => uint256)) allowed;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balances[msg.sender] = _totalSupply;
        
    }

    /**
     * minting function
     */
    function mint(uint256 amount) external {
        balances[msg.sender] += amount;
        _totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    /**
     * burning function
     */
    function burn(uint256 amount) external {
        require(
            balances[msg.sender] >= amount,
            "The amount can't exceed the owner's balance"
        );

        balances[msg.sender] -= amount;
        _totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    // /**
    //  * get balance of address
    //  */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }


    // /**
    //  * transfer from msg.sender to recipient
    //  */
  function transfer(address recipient, uint amount) external returns (bool) {
        require(balances[msg.sender]>=amount, "The amount exceeds available tokens");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // /**
    //  * approve the amount to spend
    //  */
    function approve(address spender, uint amount) external returns (bool) {
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // /**
    //  * return the total supply
    //  */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function transferFrom(
        address owner,
        address buyer,
        uint amount
    ) external returns (bool) {
        require(amount <= balances[owner]);
        require(amount <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner]-amount;
        allowed[owner][msg.sender] -= amount;
        balances[buyer] += amount;
        emit Transfer(owner, buyer, amount);
        return true;
    }
    
    

 function allowance(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }
}
