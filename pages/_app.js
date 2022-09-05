import { createTheme, NextUIProvider } from "@nextui-org/react";
import 'sf-font';
import { Text, Navbar } from '@nextui-org/react';
import Footer from './footer';
import { Logo } from "./logo";

const theme = createTheme({
  type: "dark",
  theme: {
    fontFamily:'SF Pro Display',
    colors: {
      primaryLight: '$blue200',
      primaryLightHover: '$blue300',
      primaryLightActive: '$blue400',
      primaryLightContrast: '$blue600',
      primary: '$purple500',
      primaryBorder: '$blue500',
      primaryBorderHover: '$blue600',
      primarySolidHover: '$blue700',
      primarySolidContrast: '$white',
      primaryShadow: '$white500',
      transparent: '#00000000',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple300 90%)',
      link: '#5E1DAD',

      myColor: '#00000030'

    },
    space: {},
    fonts: {}
  }
})

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider theme={theme}>
        <Navbar variant="sticky">
          <Navbar.Brand>
            <Logo />
            <Text color="inherit" hideIn="xs" size={30} css={{fontWeight:"600",textShadow:'0px 0px 3px #ffffff'}}>
              Net2Dev MarketPlace
            </Text>
          </Navbar.Brand>
          <Navbar.Content activeColor="secondary" hideIn="xs" variant="underline">
            <a style={{fontFamily:'SF Pro Display', fontSize:'25px', color:'white', fontWeight:'500'}} href="/">Home</a>
            <a style={{fontFamily:'SF Pro Display', fontSize:'25px', color:'white', fontWeight:'500'}} href="/create">
              Create
            </a>
            <a style={{fontFamily:'SF Pro Display', fontSize:'25px', color:'white', fontWeight:'500'}} href="/mint">Minter</a>
            <a style={{fontFamily:'SF Pro Display', fontSize:'25px', color:'white', fontWeight:'500'}} href="/portal">My Portal</a>
          </Navbar.Content> 
        </Navbar>            
        <Component {...pageProps} />
        <Footer>
          <Footer />
        </Footer>
        </NextUIProvider>
  );
}

export default MyApp;
