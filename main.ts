// import { AES, SHA256 } from "crypto-ts"
import { SHA256 } from "crypto-js"

class Block {
  index: number;
  timestamp: Date;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;

  constructor(index: number, timestamp: Date, data: any, previousHash: string) {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash(): string {
    const hashed: string = SHA256(this.index.toString() + this.timestamp.toString() + JSON.stringify(this.data) + this.previousHash + (this.nonce||0).toString()).toString()
    return hashed
  }

  mineBlock(difficultly: number) {
    while(this.hash.substring(0, difficultly) !== Array(difficultly + 1).join("0")) {
      this.nonce++
      this.hash = this.calculateHash()
    }
    console.log("Block mined", this.hash)
  }
}

class Chain{
  chain: Array<Block>;

  constructor() {
    const firstBlock = this.createGenesisBlock()
    this.chain = [firstBlock];
  }

  createGenesisBlock(): Block {
    return new Block(0, new Date(), {}, "")
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock: Block) {
    const latestBlock: Block = this.getLatestBlock()
    newBlock.previousHash = latestBlock.hash
    // newBlock.hash = newBlock.calculateHash()
    newBlock.mineBlock(1)
    this.chain.push(newBlock)
  }

  isChainValid(): boolean {
    for(let blockIndex = 1; blockIndex < this.chain.length - 1; blockIndex++) {
      const currentBlock: Block = this.chain[blockIndex]
      const previousBlock: Block = this.chain[blockIndex -1]

      if(currentBlock.hash !== currentBlock.calculateHash()) return false
      if(currentBlock.previousHash !== previousBlock.hash) return false
    }
    return true
  }
}

const donChain: Chain = new Chain()
donChain.addBlock(new Block(donChain.chain.length, new Date(), {dataName: "test"}, donChain.getLatestBlock().hash))
console.log("Is Valid", donChain.isChainValid())

console.log(donChain);
