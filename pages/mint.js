import { ethers } from 'ethers';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Web3Modal from "web3modal";
import NFTCollection from '../engine/NFTCollection.json';
import { nftcollection } from '../engine/configuration';
import { Card, Button, Input, Col, Row, Spacer, Container, Text } from '@nextui-org/react';
import 'sf-font'

export default function createMarket() {
    const [formInput, updateFormInput] = useState({ amount: '' })

    const router = useRouter()

    async function mintNFT() {
        const { amount } = formInput
        const quantity = Number(amount);
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const user = (await signer.getAddress()).toString()
        let contract = new ethers.Contract(nftcollection, NFTCollection, signer)
        let transaction = await contract.mint(user, quantity)
        await transaction.wait()
        router.push('/portal')
    }

    return (
        <div>
          <Spacer></Spacer>
          <Container lg gap={2} css={{ fontFamily: 'SF Pro Display', fontWeight: '200' }}>
          <Text h2>NFT Minter Portal</Text>
            <Row gap={4}>
              <Col css={{ marginRight: '$7' }}>
              <Spacer></Spacer>
                <Card css={{ marginTop: '$5', marginBottom: '$5' }}>
                  <Card.Body style={{ backgroundColor: "#00000040" }}>
                    <Text>Test Mint from NFT Collection</Text>
                  </Card.Body>
                </Card>
                <img src='alchemy-white.png' style={{maxWidth:'300px'}} />
              </Col>
              <Col>
              <Spacer></Spacer>
                <Text h3>Mint Dashboard</Text>
                <Card style={{ maxWidth: '300px', background: '#000000', boxShadow: '0px 0px 5px #ffffff60' }}>
              <Container css={{ marginBottom: '$2' }}>
                <Input
                  css={{ marginTop: '$2' }}
                  placeholder="Set Quantity - MAX 4"
                  aria-label="Set Quantity - MAX 4"
                  onChange={e => updateFormInput({ ...formInput, amount: e.target.value })}
                />
                <Button size="sm" style={{ fontSize: '20px' }} onPress={mintNFT} css={{ marginTop: '$2', marginBottom: '$5', color:'$gradient' }}>
                  MINT
                </Button>
                </Container>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
