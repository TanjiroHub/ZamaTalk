// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint256, externalEuint256} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title FHEMessengerFull
/// @notice A decentralized private messenger with end-to-end encryption using Fully Homomorphic Encryption (FHE).
/// @dev This contract provides profile management, conversation management, and encrypted messaging.
contract FHEMessengerFull is SepoliaConfig {
    // ===== ENUMS =====
    /// @notice Status of a message or conversation
    enum Status {
        SENT,
        DELIVERED,
        READ
    }

    // ===== STRUCTS =====
    /// @notice User profile information
    struct UserProfile {
        string name; // Unique display name
        string avatarUrl; // Link to avatar image
        uint64 createdAt; // Timestamp of creation
        bool active; // Whether the profile is active
    }

    /// @notice Represents a conversation between two users
    struct Conversation {
        uint256 id;
        address sender; // The address that initiated the conversation
        address receiver; // The other participant
        uint64 createdAt; // Creation timestamp
        Status status; // Current status of the conversation
    }

    /// @notice Represents a message sent within a conversation
    struct Message {
        uint256 id;
        uint256 conversationId;
        address sender; // Sender address
        address receiver; // Receiver address
        uint64 createdAt; // Timestamp of message creation
        Status status; // Status of the message (SENT, DELIVERED, READ)
        euint256[] content; // Encrypted message chunks
    }

    // ===== STORAGE =====
    uint256 private _nextConversationId = 1;
    uint256 private _nextMessageId = 1;

    mapping(address => UserProfile) public profiles;
    mapping(string => address) private _nameToAddress;

    mapping(uint256 => Conversation) public conversations;
    mapping(uint256 => Message) public messages;
    mapping(uint256 => uint256[]) private _conversationIndex;

    mapping(bytes32 => uint256) private _conversationLookup;

    // ===== EVENTS =====
    event ProfileCreated(address indexed user, string name);
    event ProfileUpdated(address indexed user, string field);
    event ConversationCreated(uint256 conversationId, address sender, address receiver);
    event MessageSent(uint256 messageId, uint256 conversationId, address from, address to);

    // ===== INTERNAL UTILS =====

    /// @notice Returns the current block timestamp as uint64
    function _now() private view returns (uint64) {
        return uint64(block.timestamp);
    }

    /// @notice Generates a unique key for a conversation between two addresses
    /// @dev Order of addresses is normalized to avoid duplicates
    /// @param a First participant
    /// @param b Second participant
    /// @return bytes32 Hash key for the conversation
    function _convKey(address a, address b) private pure returns (bytes32) {
        return (a < b) ? keccak256(abi.encodePacked(a, b)) : keccak256(abi.encodePacked(b, a));
    }

    // ===== USER PROFILE =====

    /// @notice Creates a new profile for the caller
    /// @param name Unique display name
    /// @param avatarUrl URL link to avatar image
    function createProfile(string memory name, string memory avatarUrl) external {
        require(bytes(name).length > 0, "Empty name");
        require(bytes(profiles[msg.sender].name).length == 0, "Profile exists");
        require(_nameToAddress[name] == address(0), "Name taken");

        profiles[msg.sender] = UserProfile({name: name, avatarUrl: avatarUrl, createdAt: _now(), active: true});
        _nameToAddress[name] = msg.sender;

        emit ProfileCreated(msg.sender, name);
    }

    /// @notice Updates the avatar URL of the caller's profile
    /// @param newAvatar The new avatar URL
    function updateAvatar(string memory newAvatar) external {
        require(bytes(profiles[msg.sender].name).length > 0, "Profile not found");
        profiles[msg.sender].avatarUrl = newAvatar;
        emit ProfileUpdated(msg.sender, "avatar");
    }

    /// @notice Deactivates the caller's profile
    function deactivateProfile() external {
        require(bytes(profiles[msg.sender].name).length > 0, "Profile not found");
        profiles[msg.sender].active = false;
        emit ProfileUpdated(msg.sender, "deactivate");
    }

    /// @notice Checks if a given name is already taken
    /// @param name The name to check
    /// @return bool True if name exists, false otherwise
    function nameExists(string calldata name) external view returns (bool) {
        return _nameToAddress[name] != address(0);
    }

    /// @notice Resolves a name to its associated wallet address
    /// @param name The display name
    /// @return address Wallet address bound to the name
    function resolveName(string calldata name) external view returns (address) {
        return _nameToAddress[name];
    }

    // ===== CONVERSATIONS =====

    /// @notice Retrieves or creates a conversation between two addresses
    /// @dev If conversation already exists, returns its id. Otherwise creates a new one.
    /// @param from First participant
    /// @param to Second participant
    /// @return uint256 Conversation ID
    function _getOrCreateConversation(address from, address to) internal returns (uint256) {
        bytes32 key = _convKey(from, to);
        uint256 convId = _conversationLookup[key];
        if (convId != 0) return convId;

        convId = _nextConversationId++;
        conversations[convId] = Conversation({
            id: convId,
            sender: from,
            receiver: to,
            createdAt: _now(),
            status: Status.SENT
        });
        _conversationLookup[key] = convId;

        emit ConversationCreated(convId, from, to);
        return convId;
    }

    /// @notice Retrieves all conversations where caller is either sender or receiver
    /// @return out Array of Conversation structs
    function myConversations() external view returns (Conversation[] memory out) {
        uint256 count;
        for (uint256 i = 1; i < _nextConversationId; i++) {
            if (conversations[i].sender == msg.sender || conversations[i].receiver == msg.sender) {
                count++;
            }
        }
        out = new Conversation[](count);
        uint256 j;
        for (uint256 i = 1; i < _nextConversationId; i++) {
            if (conversations[i].sender == msg.sender || conversations[i].receiver == msg.sender) {
                out[j++] = conversations[i];
            }
        }
    }

    // ===== MESSAGING =====

    /// @notice Sends a new encrypted message in a conversation
    /// @dev If conversation does not exist, it will be created
    /// @param to Recipient address
    /// @param contentExt Encrypted message chunks (external form)
    /// @param proofs Cryptographic proofs for the encrypted chunks
    function sendMessage(address to, externalEuint256[] calldata contentExt, bytes[] calldata proofs) external {
        require(to != address(0), "Invalid recipient");
        require(contentExt.length == proofs.length, "Mismatched chunks");

        uint256 convId = _getOrCreateConversation(msg.sender, to);

        euint256[] memory contentCT = new euint256[](contentExt.length);
        for (uint256 i = 0; i < contentExt.length; i++) {
            contentCT[i] = FHE.fromExternal(contentExt[i], proofs[i]);
            FHE.allowThis(contentCT[i]);
            FHE.allow(contentCT[i], msg.sender);
            FHE.allow(contentCT[i], to);
        }

        uint256 msgId = _nextMessageId++;
        messages[msgId] = Message({
            id: msgId,
            conversationId: convId,
            sender: msg.sender,
            receiver: to,
            createdAt: _now(),
            status: Status.SENT,
            content: contentCT
        });
        _conversationIndex[convId].push(msgId);

        emit MessageSent(msgId, convId, msg.sender, to);
    }

    /// @notice Retrieves all messages in a conversation and automatically marks them as READ for the caller
    /// @dev Both sender and receiver can call this. Status is updated to READ for their view.
    /// @param conversationId ID of the conversation
    /// @return out Array of Message structs
    function getMessages(uint256 conversationId) external returns (Message[] memory out) {
        uint256[] memory ids = _conversationIndex[conversationId];
        out = new Message[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            Message storage m = messages[ids[i]];
            out[i] = m;

            if ((m.receiver == msg.sender || m.sender == msg.sender) && m.status != Status.READ) {
                m.status = Status.READ;
            }
        }

        if (
            conversations[conversationId].sender == msg.sender || conversations[conversationId].receiver == msg.sender
        ) {
            conversations[conversationId].status = Status.READ;
        }
    }
}
