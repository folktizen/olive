// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "oz/token/ERC721/ERC721.sol";

contract ERC721Mintable is ERC721 {
  constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

  function mint(address to, uint256 tokenId) public {
    _mint(to, tokenId);
  }

  function burn(uint256 tokenId) public {
    _burn(tokenId);
  }
}
