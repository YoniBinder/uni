const { ethers } = require('ethers')
const { abi: IUniswapV3PoolABI } = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
const { abi: SwapRouterABI} = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json')
const { getPoolImmutables, getPoolState } = require('./helpers')
const ERC20ABI = require('./abi.json')

require('dotenv').config()
const INFURA_URL_TESTNET = process.env.INFURA_URL_TESTNET
const WALLET_ADDRESS = process.env.WALLET_ADDRESS
const WALLET_SECRET = process.env.WALLET_SECRET

const provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET) // Ropsten
const poolAddress = "0x90b07e2096098f77d7cEbb6C03A3537Ae2B89d5e" // DAI/WETH
const swapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

const name0 = 'Wrapped Ether'
const symbol0 = 'WETH'
const decimals0 = 18
const address0 = '0xc778417E063141139Fce010982780140Aa0cD5Ab'

const name1 = 'DAI Token'
const symbol1 = 'UNI'
const decimals1 = 18
const address1 = '0xaD6D458402F60fD3Bd25163575031ACDce07538D'



async function main() {
  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI,
    provider
  )

  const immutables = await getPoolImmutables(poolContract)
  const state = await getPoolState(poolContract)

  const wallet = new ethers.Wallet(WALLET_SECRET)
  const connectedWallet = wallet.connect(provider)

  const swapRouterContract = new ethers.Contract(
    swapRouterAddress,
    SwapRouterABI,
    provider
  )

  const inputAmount = 0.001

  const amountIn = ethers.utils.parseUnits(
    inputAmount.toString(),
    decimals0
  )

  const approvalAmount = BigInt(amountIn * 100000).toString()

  const tokenContract0 = new ethers.Contract(
    address0,
    ERC20ABI,
    provider
  )

  const approvalResponse = await tokenContract0.connect(connectedWallet).approve(
    swapRouterAddress,
    approvalAmount
  )

  const params = {
    tokenIn: immutables.token0,
    tokenOut: immutables.token1,
    fee: immutables.fee,
    recipient: WALLET_ADDRESS,
    deadline: Math.floor(Date.now() / 1000) + (60 * 10),
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  }

  const transaction = swapRouterContract.connect(connectedWallet).exactInputSingle(
    params,
    {
      gasLimit: ethers.utils.hexlify(1000000)
    }
  ).then(transaction => {
    console.log(transaction)
  })
}

main()