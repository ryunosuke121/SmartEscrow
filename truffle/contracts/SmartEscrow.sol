// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SmartEscrow {
    address public owner;

    constructor(address _owner){
        owner = _owner;
    }

}
