// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error NotEnoughETH__FundContract();
error NotOwner__FundWithdraw();
error TransferFailed__FundWithdraw();
error NoETH__FundWithdraw();

contract FundMe{
    address[] private s_donaters;
    address private immutable i_deployer;
    uint256 private immutable i_mineth;
    

    event ContractFund(address indexed donaters);
    event TransferSuccessfull(bool indexed success);
    
    constructor(address deployer,uint256 mineth){
        i_deployer = deployer;
        i_mineth=mineth;
    }


    function fundContract() public payable {
        if(msg.value < i_mineth){
            revert NotEnoughETH__FundContract();
        }
        s_donaters.push(msg.sender);
        emit ContractFund(msg.sender);
    }

    function withdrawFund() public {
        if (address(this).balance < i_mineth){
            revert NoETH__FundWithdraw();
        }
        if (msg.sender != i_deployer){
            revert NotOwner__FundWithdraw();
        }
        (bool success, ) = i_deployer.call{value: address(this).balance}("");
        if (!success){
            revert TransferFailed__FundWithdraw();
        }
        emit TransferSuccessfull(success);
    }


    function getDeployer() public view returns(address deployer){
        deployer = i_deployer;
    }
    function getmineth() public view returns(uint256 mineth){
        mineth = i_mineth;
    }
}