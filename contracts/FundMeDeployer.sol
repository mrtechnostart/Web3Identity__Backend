// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FundMe.sol";

error AlreadyDeployed__FundMeDeploy();

contract FundMeDeployer {
    mapping (address => address) private s_contracts;
    address[] private s_deployers;

    event FundMe__Deployed(address indexed newFundMe,uint256 indexed mineth);
    
    
    function deployFundMe(uint256 mineth) public {
        if ((s_contracts[msg.sender]!=address(0))){
            revert AlreadyDeployed__FundMeDeploy();
        }
        address newFundMe = address(new FundMe(msg.sender,mineth));
        s_contracts[msg.sender] = newFundMe;
        s_deployers.push(msg.sender);
        emit FundMe__Deployed(newFundMe,mineth);
    }

    function getDeployers(uint256 _index) public view returns(address){
        return s_deployers[_index];
    }

    
    function getContracts(address _addr) public view returns(address){
        return s_contracts[_addr];
    }

}