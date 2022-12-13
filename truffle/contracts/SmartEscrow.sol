// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/utils/escrow/RefundEscrow.sol";
/**
* スマートエスクロー
* openzeppelinのescrow.solを継承しようと思っていたが、payee対象が複数であることから
* 新しくコントラクトを作ることにした。
*/
contract SmartEscrow is Ownable{
    using SafeMath for uint256;

    uint256 public unitPrice;
    uint256 public deadline;
    uint32 public requestNumber;
    string public url;
    uint256 public totalDeposit;

    //アドレスへの支払いが許可されているかどうか
    mapping(address => bool) public isWithdrawalAllowed;

    //一人当たりの単価と締切、ページのURLをパラメーターとしてコントラクトを初期化する
    constructor(
        uint256 _unitPrice,
        uint256 _deadline,
        uint32 _requestNumber, 
        string memory _url
        )
        {
        unitPrice = _unitPrice;
        deadline = _deadline;
        requestNumber = _requestNumber;
        url = _url;
    }

    //コントラクトに預け入れるための関数
    function makeDeposit() public payable onlyOwner{
        require(unitPrice * requestNumber <= msg.value, "funds are in short supply");
        totalDeposit = totalDeposit.add(msg.value);
    }

    //payeeへの引き出しが許可されていれば、payeeに対してunitPrice分のEtherを送る
    function withdraw(address payable payee) public {
        require(isWithdrawalAllowed[payee] == true, "withdrawal is not allowed");
        isWithdrawalAllowed[payee] = false;
        totalDeposit = totalDeposit.sub(unitPrice);
        payee.transfer(unitPrice);
    }

    //payeeによる引き出しを許可する関数
    function allowWithdrawal(address payee) public onlyOwner{
        isWithdrawalAllowed[payee] = true;
    }
}
