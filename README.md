
<a href="http://youtube.a3b.io" target="_blank"><img src="https://github.com/net2devcrypto/N2D-NFT-Marketplace/blob/main/n2DMarket.png" width="260" height="50"><a>    +  </a><img src="https://github.com/net2devcrypto/Alchemy-SDK-Quick-NFT-Market/blob/main/public/alchemy-white.png" width="260" height="60"><h2>Alchemy SDK Easy Polygon NFT Marketplace NextJS App</h2></a>
##
Be sure to watch my Youtube video so you can learn and follow along!

** THE FILES ATTACHED TO THIS REPO ARE FOR EDUCATIONAL PURPOSES ONLY **

** NOT FINANCIAL ADVISE **

** USE IT AT YOUR OWN RISK** **I'M NOT RESPONSIBLE FOR ANY USE, ISSUES ETC.. **

Be sure to watch my Youtube video so you can learn and follow along!

<a href="https://youtu.be/zD70q-A5YN0" target="_blank"><img src="https://github.com/net2devcrypto/misc/blob/main/ytlogo2.png" width="150" height="40"></a> 

## Step 1

Create your Alchemy Account and create an app for Polygon Mumbai then copy your API key and HTTP API Url.

https://alchemy.com/?a=75f66fc89b

## Step 2

1-Create a new NextJS Application:

```shell
npx create-next-app alchemymarket
```

2-Navigate to project folder and install dependencies:

```shell
cd alchemymarket
npm i alchemy-sdk ethers sf-font axios @nextui-org/react web3modal web3
npm i --save-dev @types/canvas-confetti
npm i --save-dev @types/react
npm i react-multi-carousel ipfs-http-client
```

## Step 3

Copy all folders from this repo and drop them in the project folder. Replace
files when prompted.

## Step 4

Deploy all Smart Contracts located in the contracts folder to Polygon Mumbai.
Deploy in the following order:

1- NFT-ERC721-Collection-SmartContract-v2.sol

Save the contract address to text.

2- NFT-Market-Resell-SmartContract-v2.sol

During deployment please add the NFT Collection contract address
previously deployed when prompted.

Save the contract address to text.

3- NFT-Marketplace-SmartContract-v2.sol

Save the contract address to text.

4- NFT-Market-Creator-SmartContract-v2.sol

During deployment please add the NFT Marketplace contract address
previously deployed when prompted.

Save the contract address to text.

## Step 5

Setup a local IPFS API Node to interact with the marketplace.

1-Download, install and run IPFS.

https://github.com/ipfs/ipfs-desktop/releases

2-Download and extract IPFS CLI (Kubo).

https://dist.ipfs.tech/#kubo

3-Using either shell/cmd/powershell, Navigate to the Kubo folder and enable CORS and API Access from any client.

Shell or CMD:
```shell
cd kubo
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"GET\", \"POST\"]'
ipfs config --json Addresses.API \"/ip4/0.0.0.0/tcp/5001\"
```

or using Powershell:
```shell
cd kubo
./ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'
./ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"GET\", \"POST\"]'
./ipfs config --json Addresses.API \"/ip4/0.0.0.0/tcp/5001\"
```

4- Restart IPFS.

## Step 6

Proceed to update the configuration.js file located under "engine" folder in your
project. 

1-Update each smart contract var with your deployed contract addressed:
```shell
export var nftcollection = "ADD_CONTRACT_ADDRESS"
export var nftresell = "ADD_CONTRACT_ADDRESS"
export var marketcontract = "ADD_CONTRACT_ADDRESS"
export var nftcreator = "ADD_CONTRACT_ADDRESS"
```

2-Update the ipfs client var with the IP address of server you installed in step 5:
```shell
export const client = ipfsHttpClient('http://IP_ADDRESS_OF_THIS_SERVER:5001');
```

3-Update the alchemyapi var with the Alchemy http API address copied on step 1:

```shell
export var alchemyapi = "ADD_API_HTTPS_ADDRESS";
```

Save the configuration.js file

## Step 7

1- Create a new env file in the project root folder and add the server's IP in
the NEXT_PUBLIC_API_SERVER entry. Make sure its located in the project root
folder. Update the url with your server's IP.

file name must be:  ".env.local"

```shell
NEXT_PUBLIC_API_SERVER='http://ADD_IP_ADDRESS_OF_THIS_SERVER:3000/api/hello'
```

Example:

<img src="https://github.com/net2devcrypto/Alchemy-SDK-Quick-NFT-Market/blob/main/env-screenshot.PNG" width="460" height="150">

Save file.

2- Navigate to hello.js located under Pages/API folder and update with the contract deployer wallet private key and also Alchemy API key.

Update "name" with wallet private key:

Update "alchemykey" with your Alchemy API Key:
```shell
export default function handler(req, res) {
  res.status(200).json({ 
    name: 'ADD_CONTRACT_OWNER_WALLET_PRIVATE_KEY',
alchemykey: 'ADD_ALCHEMY_API_KEY' })
}
```
Save hello.js file.

## Step 8

Navigate to the project and start !

```shell
npm run dev
```

Please watch tutorial video for additional information.
Enjoy!


