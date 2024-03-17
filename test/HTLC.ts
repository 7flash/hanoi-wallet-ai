import { expect } from "chai";
import { ethers } from "hardhat";

describe("HTLC", function () {
  let HTLC, htlc, owner, addr1, addr2, addrs;

  beforeEach(async function () {
    HTLC = await ethers.getContractFactory("HTLC");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    htlc = await HTLC.deploy();
    await htlc.deployed();
  });

  describe("Swap", function () {
    it("Should initiate a swap correctly", async function () {
      const amount = ethers.utils.parseEther("1");
      const hashlock = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("secret"));
      const timelock = Math.floor(Date.now() / 1000) + 60; // 1 minute from now

      await htlc.connect(addr1).initiateSwap(addr2.address, hashlock, timelock, { value: amount });

      const swapID = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "bytes32", "uint256"],
        [addr1.address, addr2.address, amount, hashlock, timelock]
      ));

      const swap = await htlc.swaps(swapID);
      expect(swap.amount).to.equal(amount);
      expect(swap.hashlock).to.equal(hashlock);
      expect(swap.timelock).to.equal(timelock);
      expect(swap.sender).to.equal(addr1.address);
      expect(swap.receiver).to.equal(addr2.address);
    });

    it("Should complete a swap correctly", async function () {
      const amount = ethers.utils.parseEther("1");
      const secret = "secret";
      const hashlock = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(secret));
      const timelock = Math.floor(Date.now() / 1000) + 60; // 1 minute from now

      await htlc.connect(addr1).initiateSwap(addr2.address, hashlock, timelock, { value: amount });

      const swapID = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "bytes32", "uint256"],
        [addr1.address, addr2.address, amount, hashlock, timelock]
      ));

      await htlc.connect(addr2).completeSwap(swapID, ethers.utils.toUtf8Bytes(secret));

      const swap = await htlc.swaps(swapID);
      expect(swap.amount).to.equal(0);
    });

    it("Should refund a swap correctly", async function () {
      const amount = ethers.utils.parseEther("1");
      const hashlock = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("secret"));
      const timelock = Math.floor(Date.now() / 1000) - 60; // 1 minute ago

      await htlc.connect(addr1).initiateSwap(addr2.address, hashlock, timelock, { value: amount });

      const swapID = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "bytes32", "uint256"],
        [addr1.address, addr2.address, amount, hashlock, timelock]
      ));

      await htlc.connect(addr1).refundSwap(swapID);

      const swap = await htlc.swaps(swapID);
      expect(swap.amount).to.equal(0);
    });
  });
});
