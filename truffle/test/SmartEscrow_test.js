const SmartEscrowContract = artifacts.require("SmartEscrow");

contract("SmartEscrow", (accounts) => {
    let smartEscrow;
    const owner = accounts[0];

    describe("initialization", () => {

        beforeEach(async () => {
            smartEscrow = await SmartEscrowContract.new(owner);
        });

        it("gets the beneficialy owner", async () => {
            const actual = await smartEscrow.owner();
            assert.equal(actual, owner, "owner should match");
        });
    });

})