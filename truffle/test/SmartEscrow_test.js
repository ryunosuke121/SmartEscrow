const SmartEscrowContract = artifacts.require("SmartEscrow");

contract("SmartEscrow", (accounts) => {
    let smartEscrow;
    const unitPrice = web3.utils.toWei('0.3');
    const deadline = 3600;
    const reqNumber = 5;
    const url = "beneficiaryname.org";
    const owner = accounts[0];
    const payee = accounts[1];

    describe("initialization", () => {

        beforeEach(async () => {
            smartEscrow = await SmartEscrowContract.new(
                unitPrice,
                deadline,
                reqNumber,
                url
            );
        });

        it("gets the beneficialy unitPrice", async () => {
            const actual = await smartEscrow.unitPrice();
            assert.equal(actual, unitPrice, "unitPrice should match");
        });

        it("gets the beneficialy deadline ", async () => {
            const actual = await smartEscrow.deadline();
            assert.equal(actual, deadline, "deadline should match");
        });

        it("gets the beneficialy reqNumber", async () => {
            const actual = await smartEscrow.requestNumber();
            assert.equal(actual, reqNumber, "reqNumber should match");
        });

        it("gets the beneficialy url", async () => {
            const actual = await smartEscrow.url();
            assert.equal(actual, url, "url should match");
        });

    });

    describe("make deposits", () => {
        
        const value = web3.utils.toWei('2.5');

        it("increase the totalDeposit amount", async () => {
            const currentDeposit = await smartEscrow.totalDeposit();
            await smartEscrow.makeDeposit({
                from: owner,
                value: value
            });
            const newDeposit = await smartEscrow.totalDeposit();
            const diff = newDeposit - currentDeposit;
            assert.equal(diff, value, "diff should match");
        });
    });

    describe("withdraw unitPrice from deposit", () => {

        it("throws error when payee is not allowed", async () => {
            try{
                await smartEscrow.withdraw(payee,{from: owner});
                assert.fail("withdraw is not restricted");
            }catch(err){
                const expectedError = "withdrawal is not allowed";
                const actualError = err.reason;
                assert.equal(actualError, expectedError, "should not be withdrawn");
            }
        });

        it("allow withdrawal from payee", async () => {
            await smartEscrow.allowWithdrawal(payee, {from: owner});
            const isWithdrawalAllowed = await smartEscrow.isWithdrawalAllowed(payee);
            assert.equal(isWithdrawalAllowed, true, "should be true");
        });

        it("withdraw unitPrice", async () => {
            const currentPayeeBalance = await web3.eth.getBalance(payee);
            //{from:payee}とすると、ガス代の支払い元がpayeeになるので、一致しなくなる
            await smartEscrow.withdraw(payee,{from: owner});
            const newPayeeBalance = await web3.eth.getBalance(payee);
            const diffPayeeBalance = newPayeeBalance - currentPayeeBalance;
            assert.equal(unitPrice, diffPayeeBalance, "should match");
        });

        it("subtract unitPrice from totalDeposit", async () => {
            await smartEscrow.allowWithdrawal(payee, {from: owner});
            const currentTotalDeposit = await smartEscrow.totalDeposit();
            await smartEscrow.withdraw(payee,{from: owner});
            const newTotalDeposit = await smartEscrow.totalDeposit();
            const diffTotalDeposit = currentTotalDeposit - newTotalDeposit;
            assert.equal(diffTotalDeposit, unitPrice, "should match"); 
        });
    });
})