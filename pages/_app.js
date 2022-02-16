import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import {  Web3Context } from '../context/web3Context';

function getLibrary(provider){
  return new Web3(provider)
};

function MyApp({ Component, pageProps }) {
  const web3 = new Web3(Web3.givenProvider);
  return (
    <Web3ReactProvider getLibrary={getLibrary} cacheWalletSelection={true}>
    <Web3Context.Provider value={{web3}}>
    <ChakraProvider>
    <Component {...pageProps} />
    </ChakraProvider>
    </Web3Context.Provider>
    </Web3ReactProvider>
  )
}

export default MyApp
