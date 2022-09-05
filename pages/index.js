import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Web3Modal from "web3modal";
import { useRouter } from 'next/router';
import Resell from '../engine/Resell.json';
import NFT from '../engine/NFT.json';
import Market from '../engine/Market.json';
import axios from 'axios';
import { Grid, Card, Text, Button, Row, Container } from '@nextui-org/react';
import { nftcreator, marketcontract, nftresell } from '../engine/configuration';
import { Alchemy, Network } from "alchemy-sdk";
import confetti from 'canvas-confetti';
import 'sf-font';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


export default function Home(props) {
  const [resellnft, getResellNfts] = useState([])
  const [marketnft, getMarketNfts] = useState([])

  var alchemysettings = {
    apiKey: props.res.alchemykey, 
    network: Network.MATIC_MUMBAI,
  }

  useEffect(() => {
    loadAlchemyResell()
    loadAlchemyNewNFTs()
  }, [getResellNfts, getMarketNfts])

  const handleConfetti = () => {
    confetti();
  };
  const router = useRouter()

  /*
  Mumbai Listings Functions
  */
  async function loadAlchemyResell() {
    const alchemy = new Alchemy(alchemysettings)
    const provider = await alchemy.config.getProvider()
    const wallet = new ethers.Wallet(props.res.name, provider)
    const contract = new ethers.Contract(nftresell, Resell, wallet)
    const itemArray = []
    const mintedNfts = await alchemy.nft.getNftsForOwner(nftresell)
    for (const nft of mintedNfts.ownedNfts) {
      let token = nft.tokenId
      let rawprice = contract.getPrice(token)
      let imagePath = nft.rawMetadata.image
      if (imagePath == undefined) {
        console.log("")
      } else {
        Promise.resolve(rawprice).then((_hex) => {
          let img = imagePath.replace("ipfs://", "https://ipfs.io/ipfs/")
          let desc = nft.description
          var salePrice = Number(_hex)
          let formatprice = ethers.utils.formatUnits(salePrice.toString(), "ether");
          let nftdata = {
            name: nft.rawMetadata.name,
            image: img,
            tokenId: token,
            description: desc,
            value: formatprice,
          }
          itemArray.push(nftdata)
        })
      }
    }
    await new Promise(r => setTimeout(r, 3000));
    getResellNfts(itemArray)
  }

  async function loadAlchemyNewNFTs() {
    const alchemy = new Alchemy(alchemysettings)
    const provider = await alchemy.config.getProvider()
    const wallet = new ethers.Wallet(props.res.name, provider)
    const tokenContract = new ethers.Contract(nftcreator, NFT, wallet)
    const marketContract = new ethers.Contract(marketcontract, Market, wallet)
    const data = await marketContract.getAvailableNft()
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    getMarketNfts(items)
  }

    async function buyMarketNfts(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketcontract, Market, signer)
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.n2DMarketSale(nftcreator, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadAlchemyNewNFTs();
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1 
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 
    }
  };

  return (
    <div>
      <div>
        <Container
          xl
          style={{
            backgroundImage:
              "linear-gradient(to top, #020202, #050505, #080808, #0b0b0b, #0e0e0e, #16141a, #1e1724, #291a2d, #451a3a, #64133c, #820334, #9b0022)",
          }}
        >
          <Container xs css={{ marginBottom: "$3" }}>
            <Text css={{ marginLeft: "$40", justifyContent: "" }} h2>
              Top Collections
            </Text>
            <Carousel
              swipeable={false}
              draggable={false}
              showDots={true}
              responsive={responsive}
              ssr={true}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={6000}
              keyBoardControl={true}
              customTransition="all .5"
              transitionDuration={800}
              containerClass="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-200-px"
            >
              {resellnft.map((nft, i) => (
                <div key={i}>
                  <img src={nft.image} key={i} />
                  <Text h4>TokenId:{" " + nft.tokenId}</Text>
                </div>
              ))}
            </Carousel>
          </Container>
        </Container>
      </div>
      <Container sm="true">
        <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
          <Text h3>Latest NFTs in Marketplace</Text>
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {resellnft.slice(0, 9).map((nft, id) => {
            async function buylistNft() {
              const rawBuy = nft.value;
              const cost = rawBuy * 1e18;
              const web3Modal = new Web3Modal();
              const connection = await web3Modal.connect();
              const provider = new ethers.providers.Web3Provider(connection);
              const signer = provider.getSigner();
              const contract = new ethers.Contract(nftresell, Resell, signer);
              const transaction = await contract.buyNft(nft.tokenId, {
                value: cost,
              });
              await transaction.wait();
              router.push("/portal");
            }
            return (
              <Grid key={id} xs={3}>
                <Card
                  key={id}
                  style={{ boxShadow: "0px 0px 5px #ffffff" }}
                  variant="bordered"
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "SF Pro Display",
                      fontWeight: "200",
                      fontSize: "20px",
                      marginLeft: "3px",
                    }}
                  >
                    {nft.name} Token-{nft.tokenId}
                  </Text>
                  <Card.Body css={{ p: 0 }}>
                    <Card.Image
                      style={{ maxWidth: "150px", borderRadius: "6%" }}
                      src={nft.image}
                    />
                  </Card.Body>
                  <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row wrap="wrap" justify="space-between" align="center">
                      <Text>{nft.description}</Text>
                      <p style={{ fontSize: "30px" }}>
                        {nft.value}{" "}
                        <img
                          src="matic.svg"
                          style={{
                            width: "40px",
                            height: "35px",
                          }}
                        />
                      </p>
                      <Button
                        color="gradient"
                        style={{ fontSize: "20px" }}
                        onPress={() => handleConfetti(buylistNft(nft))}
                      >
                        Buy
                      </Button>
                    </Row>
                  </Card.Footer>
                </Card>
              </Grid>
            );
          })}
        </Grid.Container>
      </Container>
      <Container sm="true">
        <Grid.Container gap={1} justify="flex-start">
          {marketnft.slice(0, 9).map((nft, i) => (
            <Grid key={i} xs={3}>
              <Card
                style={{ boxShadow: "0px 0px 5px #ffffff" }}
                variant="bordered"
                key={i}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "SF Pro Display",
                    fontWeight: "200",
                    fontSize: "20px",
                    marginLeft: "3px",
                  }}
                >
                  {nft.name}
                </Text>
                <Card.Body css={{ p: 0 }}>
                  <Card.Image
                    style={{ maxWidth: "150px", borderRadius: "6%" }}
                    src={nft.image}
                  />
                </Card.Body>
                <Card.Footer css={{ justifyItems: "flex-start" }}>
                  <Row wrap="wrap" justify="space-between" align="center">
                    <Text wrap="wrap">{nft.description}</Text>
                    <Text style={{ fontSize: "30px" }}>
                      {nft.price}
                      <img
                        src="matic.svg"
                        style={{
                          width: "40px",
                          height: "35px",
                        }}
                      />
                    </Text>
                    <Button
                      color="gradient"
                      style={{ fontSize: "20px" }}
                      onClick={() => handleConfetti(buyMarketNfts(nft))}
                    >
                      Buy
                    </Button>
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
      </Container>
    </div>
  );
}
export async function getServerSideProps() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_SERVER).then(
    (response) => response.json()
  );

  return {
    props: { res }
  };
}