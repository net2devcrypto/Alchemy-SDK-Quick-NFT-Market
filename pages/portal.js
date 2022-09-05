import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import Resell from '../engine/Resell.json';
import NFTCollection from '../engine/NFTCollection.json';
import { Card, Button, Col, Row, Container, Text, Grid, Input } from '@nextui-org/react';
import 'sf-font';
import Web3 from 'web3';
import { nftresell, nftcollection, nftcreator } from '../engine/configuration';
import { Alchemy, Network } from "alchemy-sdk";

export default function Sell(props) {
  const [nfts, getNfts] = useState([])
  const [loaded, awaitLoading] = useState('not-loaded')
  const [resalePrice, updateresalePrice] = useState({ price: ''})

  var alchemysettings = {
    apiKey: props.res.alchemykey, 
    network: Network.MATIC_MUMBAI,
  }

  var account = null;
  var web3 = null;

    useEffect(() => {
      getAlchemyNFTs()
    }, [getNfts])

    async function getAlchemyNFTs() {
      const alchemy = new Alchemy(alchemysettings);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      web3 = new Web3(connection);
      await connection.send("eth_requestAccounts");
      var accounts = await web3.eth.getAccounts();
      account = accounts[0];
      var itemArray = [];
      document.getElementById("wallet-address").textContent = account;
      const mintedNfts = await alchemy.nft.getNftsForOwner(account);
      console.log(mintedNfts)
      for (const nft of mintedNfts.ownedNfts) {
        let contractaddr = nft.contract.address;
        let token = nft.tokenId;
        let collection = nftcollection.toLowerCase();
        if (contractaddr === collection) {
          const response = await alchemy.nft.getNftMetadata(
            contractaddr,
            token
          )
          await new Promise((r) => setTimeout(r, 1000));
          let name = response.title;
          let imagePath = response.rawMetadata.image;
          if (imagePath == undefined) {
            console.log("");
          } else {
            let img = imagePath.replace("ipfs://", "https://ipfs.io/ipfs/");
            let desc = response.description;
            alchemy.nft.getContractMetadata(contractaddr).then((result) => {
              let nftdata = {
                name: name,
                img: img,
                tokenId: token,
                desc: desc,
                contract: result.name,
              };
              itemArray.push(nftdata);
            });
          }
        }
        let creator = nftcreator.toLowerCase();
        if (contractaddr === creator) {
          const response = await alchemy.nft.getNftMetadata(
            contractaddr,
            token
          )
          console.log(response)
          await new Promise((r) => setTimeout(r, 1000));
          let name = response.title;
          let imagePath = response.rawMetadata.image;
          if (imagePath == undefined) {
            console.log("");
          } else {
            let img = imagePath.replace("ipfs://", "https://ipfs.io/ipfs/");
            let desc = response.description;
            alchemy.nft.getContractMetadata(contractaddr).then((result) => {
              let nftdata = {
                name: name,
                img: img,
                tokenId: token,
                desc: desc,
                contract: result.name,
              };
              itemArray.push(nftdata);
            });
          }
        }
      }
      await new Promise((r) => setTimeout(r, 1000));
      getNfts(itemArray);
      awaitLoading("loaded");
    }

if (loaded === "loaded" && !nfts.length)
  return (
    <Container md="true">
    <Row>
        <Col css={{ size: "$50", paddingLeft: "$10", paddingTop: "$1" }}>
          <Card css={{ p: "$3", backgroundColor: "$blue200", boxShadow:'0px 0px 4px #ffffff' }}>
              <Card css={{ p: "$3", marginTop:'$1'}}>
            <Text h4>
              Wallet
              </Text>
              <Text h5 id="wallet-address" css={{ color: "#39FF14" }}/>
            <Row>
              <Button
                size="sm"
                color="gradient"
                onPress={getAlchemyNFTs}
                css={{ marginRight:'4px' }}

              >
              Retrieve NFTs
              </Button>
            </Row>
            </Card>
          </Card>
        </Col>
      </Row>
     <Text h4>No NFT's Found on Wallet</Text>
     </Container>
  );

return (
    <div>
    <Container md="true">
    <Row>
        <Col css={{ size: "$50", paddingLeft: "$10", paddingTop: "$1" }}>
          <Card css={{ p: "$3", backgroundColor: "$blue200", boxShadow:'0px 0px 4px #ffffff' }}>
              <Card css={{ p: "$3", marginTop:'$1'}}>
            <Text h4>
              Wallet
              </Text>
              <Text h5 id="wallet-address" css={{ color: "#39FF14" }}/>
            <Row>
              <Button
                size="sm"
                color="gradient"
                onPress={getAlchemyNFTs}
                css={{ marginRight:'4px' }}

              >
              Retrieve NFTs
              </Button>
            </Row>
            </Card>
          </Card>
        </Col>
      </Row>
      <Row>
        <Grid.Container gap={3}>
          {nfts.map((nft, i) => {
            async function executeRelist() {
              const { price } = resalePrice;
              if (!price) return;
              try {
                relistNFT();
              } catch (error) {
                console.log("Transaction Failed", error);
              }
            }
            async function relistNFT() {
              const web3Modal = new Web3Modal()
              const connection = await web3Modal.connect()
              const provider = new ethers.providers.Web3Provider(connection);
              const signer = provider.getSigner();
              const user = (await signer.getAddress()).toString()
              const price = ethers.utils.parseUnits(
                resalePrice.price,
                "ether"
              );
              const contractnft = new ethers.Contract(
                nftcollection,
                NFTCollection,
                signer
              )
              const checkapproved = await contractnft.isApprovedForAll(user, nftresell)
              if (checkapproved === true ){
              let contract = new ethers.Contract(nftresell, Resell, signer);
              let listingFee = await contract.getListingFee();
              listingFee = listingFee.toString();
              let transaction = await contract.listSale(nft.tokenId, price, {
                value: listingFee,
              })
              await transaction.wait();
              getAlchemyNFTs();
            }
            else {
              let approval = await contractnft.setApprovalForAll(nftresell, true);
              await approval.wait()
              let contract = new ethers.Contract(nftresell, Resell, signer);
              let listingFee = await contract.getListingFee();
              listingFee = listingFee.toString();
              let transaction = await contract.listSale(nft.tokenId, price, {
                value: listingFee,
              });
              await transaction.wait();
              getAlchemyNFTs();
            }
          }
              return (
                <Grid key={i}>
                    <Card
                      isHoverable
                      css={{ mw: "240px", marginRight: "$1" }}
                      variant="bordered"
                      key={i}
                      value={i}
                    >
                      <Card.Image src={nft.img} />
                      <Card.Body md="true">
                        <h5
                          style={{
                            color: "#9D00FF",
                            fontFamily: "SF Pro Display",
                          }}
                        >
                        {nft.contract}
                        </h5>
                        <Text h6>
                          {nft.name} Token-{nft.tokenId}
                        </Text>
                        <Text css={{fontSize:'$sm'}}>{nft.desc}</Text>
                        <Input
                          size="sm"

                          css={{
                            marginTop: "$2",
                            maxWidth: "120px",
                            marginBottom: "$2",
                            border: "$blue500",
                          }}
                          style={{
                            color: "white",
                            fontFamily: "SF Pro Display",
                            fontWeight: "bolder",
                            fontSize: "15px",
                          }}
                          aria-label="Set your price"
                          placeholder="Set your Price"
                          onChange={(e) =>
                            updateresalePrice({
                              ...resalePrice,
                              price: e.target.value,
                            })
                          }
                        />
                        <Button onPress={executeRelist}>Resale NFT</Button>
                      </Card.Body>
                    </Card>
                </Grid>
              );
            })}
        </Grid.Container>
      </Row>
    </Container>
  </div>
)
}
export async function getServerSideProps() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_SERVER).then(
    (response) => response.json()
  );

  return {
    props: { res }
  };
}

