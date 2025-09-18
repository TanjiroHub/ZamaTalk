import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { expect } from "chai";
import { toUtf8Bytes, hexlify, Signer } from "ethers";
import { FHEZamaTalk } from "../types";
import { FhevmType } from "@fhevm/hardhat-plugin";

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

  // ---------- helpers ----------

  // Convert a string into 31-byte BigInt chunks
  function textToBigIntArray(text: string): bigint[] {
    const byteArray = toUtf8Bytes(text);
    const result: bigint[] = [];

    for (let offset = 0; offset < byteArray.length; offset += 31) {
      const slice = byteArray.slice(offset, offset + 31);
      const hexVal = hexlify(slice).slice(2);
      result.push(BigInt("0x" + hexVal));
    }

    return result;
  }

  // Encrypt text into ciphertext handles + proofs for contract input
  async function encryptForContract(signer: Signer, message: string): Promise<[any[], any[]]> {
    const bigintChunks = textToBigIntArray(message);
    const proofList: any[] = [];
    const handles: any[] = [];
    const MAX_PER_BATCH = 8;

    for (let start = 0; start < bigintChunks.length; start += MAX_PER_BATCH) {
      const segment = bigintChunks.slice(start, start + MAX_PER_BATCH);
      const encInput = fhevm.createEncryptedInput(contractAddress, await signer.getAddress());

      segment.forEach((val) => encInput.add256(val));
      const encrypted: any = await encInput.encrypt();

      encrypted.handles.forEach((h: any) => {
        handles.push(h);
        proofList.push(encrypted.inputProof);
      });
    }

    return [handles, proofList];
  }

  function bigIntToString(bn: bigint): string {
    let hex = bn.toString(16);
    if (hex.length % 2 !== 0) hex = "0" + hex;
    return Buffer.from(hex, "hex").toString("utf8");
  }

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

  describe("Messaging (encrypt/decrypt) + conversation", function () {
    it("should send a message and decrypt it", async function () {
      const [chunks, proofs] = await encryptForContract(signers.alice, "Hello Bob");
      await (await contract.connect(signers.alice).sendMessage(signers.bob.address, chunks, proofs)).wait();

      const convs = await contract.connect(signers.alice).myConversations();
      expect(convs.length).to.equal(1);
      expect(convs[0].sender).to.equal(signers.alice.address);
      expect(convs[0].receiver).to.equal(signers.bob.address);

      const convId = convs[0].id;
      const rawMsgs = await contract.connect(signers.bob).getMessages(convId);
      expect(rawMsgs.length).to.equal(1);

      const handles: string[] = Array.from(rawMsgs[0].content);
      let decoded = "";
      for (const handle of handles) {
        const chunk: bigint = await fhevm.userDecryptEuint(FhevmType.euint256, handle, contractAddress, signers.alice);
        decoded += bigIntToString(chunk);
      }
      expect(decoded).to.equal("Hello Bob");
    });

    it("should allow reply (sendMessage again) and decrypt reply", async function () {
      // Alice sends the first message
      const [initChunks, initProofs] = await encryptForContract(signers.alice, "Hello Bob");
      await (await contract.connect(signers.alice).sendMessage(signers.bob.address, initChunks, initProofs)).wait();

      const convs = await contract.connect(signers.alice).myConversations();
      expect(convs.length).to.be.greaterThan(0);
      const convId = convs[0].id;

      // Bob replies
      const [chunks, proofs] = await encryptForContract(signers.bob, "Hi Alice, got your messages");
      await (await contract.connect(signers.bob).sendMessage(signers.alice.address, chunks, proofs)).wait();

      const msgs = await contract.connect(signers.alice).getMessages(convId);
      const last = msgs[msgs.length - 1];

      const handles: string[] = Array.from(last.content);
      let decoded = "";
      for (const h of handles) {
        const chunk: bigint = await fhevm.userDecryptEuint(FhevmType.euint256, h, contractAddress, signers.alice);
        decoded += bigIntToString(chunk);
      }

      expect(decoded).to.equal("Hi Alice, got your messages");
    });
  });

  describe("Conversations and messages queries", function () {
    it("should return empty conversations for a new user", async () => {
      const convs = await contract.connect(signers.alice).myConversations();
      expect(convs.length).to.equal(0);
    });

    it("should list conversations for both sender and receiver", async () => {
      const [chunks, proofs] = await encryptForContract(signers.alice, "Hey Bob");
      await (await contract.connect(signers.alice).sendMessage(signers.bob.address, chunks, proofs)).wait();

      const convsAlice = await contract.connect(signers.alice).myConversations();
      const convsBob = await contract.connect(signers.bob).myConversations();

      expect(convsAlice.length).to.equal(1);
      expect(convsBob.length).to.equal(1);
      expect(convsAlice[0].id).to.equal(convsBob[0].id);
    });

    it("should return all messages in a conversation", async () => {
      const [chunks1, proofs1] = await encryptForContract(signers.alice, "Message 1");
      await (await contract.connect(signers.alice).sendMessage(signers.bob.address, chunks1, proofs1)).wait();

      const [chunks2, proofs2] = await encryptForContract(signers.bob, "Message 2");
      await (await contract.connect(signers.bob).sendMessage(signers.alice.address, chunks2, proofs2)).wait();

      const convs = await contract.connect(signers.alice).myConversations();
      const convId = convs[0].id;

      const msgs = await contract.connect(signers.alice).getMessages(convId);
      expect(msgs.length).to.equal(2);
    });
  });
});
