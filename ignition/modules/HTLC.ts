import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers/lib/utils";

const ONE_ETH: bigint = parseEther("1");

const HTLCModule = buildModule("HTLCModule", (m) => {
  const timelock = m.getParameter("timelock", Date.now() + 1000 * 60 * 60 * 24); // 24 hours from now
  const hashlock = m.getParameter("hashlock", "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"); // example hashlock
  const receiver = m.getParameter("receiver", "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"); // example receiver address
  const amount = m.getParameter("amount", ONE_ETH);

  const htlc = m.contract("HTLC");

  m.sequence([
    htlc.deploy(),
    htlc.initiateSwap(receiver, hashlock, timelock, { value: amount }),
  ]);

  return { htlc };
});

export default HTLCModule;
