import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { expect } from "chai";
import { FHEZamaTalk } from "../types";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = await ethers.getContractFactory("FHEZamaTalk");
  const contract = (await factory.deploy()) as FHEZamaTalk;
  return { contract, contractAddress: await contract.getAddress() };
}

describe("FHEZamaTalk", function () {
  let signers: Signers;
  let contract: FHEZamaTalk;
  let contractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      alice: ethSigners[1],
      bob: ethSigners[2],
    };
  });

  beforeEach(async () => {
    if (!fhevm.isMock) {
      throw new Error(`This test suite must run in FHEVM mock environment`);
    }
    ({ contract, contractAddress } = await deployFixture());
  });

  // ---------- tests ----------
  describe("Profile management", function () {
    it("should create profile", async () => {
      await expect(contract.connect(signers.alice).createProfile("Alice", "url1"))
        .to.emit(contract, "ProfileCreated")
        .withArgs(signers.alice.address, "Alice");

      const profile = await contract.profiles(signers.alice.address);
      expect(profile.name).to.eq("Alice");
      expect(profile.avatarUrl).to.eq("url1");
      expect(profile.active).to.eq(true);
    });

    it("should reject duplicate name", async () => {
      await contract.connect(signers.alice).createProfile("Alice", "url1");
      await expect(contract.connect(signers.bob).createProfile("Alice", "url2")).to.be.revertedWith("Name taken");
    });

    it("should update avatar & deactivate", async () => {
      await contract.connect(signers.alice).createProfile("Alice", "url1");

      await (await contract.connect(signers.alice).updateAvatar("newUrl")).wait();
      let profile = await contract.profiles(signers.alice.address);
      expect(profile.avatarUrl).to.eq("newUrl");

      await (await contract.connect(signers.alice).deactivateProfile()).wait();
      profile = await contract.profiles(signers.alice.address);
      expect(profile.active).to.eq(false);
    });

    it("should resolve name and existence", async () => {
      await contract.connect(signers.alice).createProfile("Alice", "url1");

      expect(await contract.resolveName("Alice")).to.eq(signers.alice.address);
      expect(await contract.nameExists("Alice")).to.eq(true);
      expect(await contract.nameExists("Bob")).to.eq(false);
    });

    it("should return my profile via getProfile", async () => {
      await (await contract.connect(signers.alice).createProfile("Alice", "url1")).wait();
      const profile = await contract.connect(signers.alice).getProfile();
    
      expect(profile.name).to.eq("Alice");
      expect(profile.avatarUrl).to.eq("url1");
    });
    
  });
});
