// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract FHEZamaTalk is SepoliaConfig {
    // ===== STRUCTS =====
    /// @notice User profile information
    struct UserProfile {
        string name;
        string avatarUrl;
        uint64 createdAt;
        bool active;
    }

    // ===== STORAGE =====
    mapping(address => UserProfile) public profiles;
    mapping(string => address) private _nameToAddress;

    // ===== EVENTS =====
    event ProfileCreated(address indexed user, string name);
    event ProfileUpdated(address indexed user, string field);

    // ===== INTERNAL UTILS =====

    /// @notice Returns the current block timestamp as uint64
    function _now() private view returns (uint64) {
        return uint64(block.timestamp);
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

    /// @notice Returns the caller's profile
    /// @return UserProfile struct of the caller
    function getProfile() external view returns (UserProfile memory) {
        require(bytes(profiles[msg.sender].name).length > 0, "Profile not found");
        return profiles[msg.sender];
    }
}
