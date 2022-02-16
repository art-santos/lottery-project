
import { Box, Button, Flex, FormControl, FormLabel, HStack, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Text, VStack } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import Head from 'next/head';
import React from 'react';
import Web3Context from '../context/web3Context';
import injected from '../eth/wallet/connectors';
import getContract from '../functions/getContract';
import getContractBalance from '../functions/getContractBalance';

export default function Home({lottery_address, lottery_abi}) {
  const { active, account, activate, deactivate } = useWeb3React();
  const [bet, setBet] = React.useState(1);
  const [balance, setBalance] = React.useState(0);
  const [lotteryContract, setLotteryContract] = React.useState({contract: '', address: '', manager: '', players: [], balance: ' ', winner: ''});
  const {web3} = React.useContext(Web3Context);

  const connectWallet = async () => {
    active ? deactivate() : await activate(injected);
  };

  React.useEffect(() => {
    const setContractItems = async () => {
      const contract = await getContract(web3, lottery_address, lottery_abi);
      const manager = await contract.methods.manager().call();
      const contractBalance = await web3.eth.getBalance(lottery_address);
      const accounts = await web3.eth.getAccounts();
      const accountBalance = await web3.eth.getBalance(accounts[0]);
      const players = await contract.methods.getPlayers().call();
      setLotteryContract({...lotteryContract, contract, address: lottery_address, manager, balance: web3.utils.fromWei(contractBalance, 'ether'), players, winner: null});
      setBalance(web3.utils.fromWei(accountBalance, 'ether'));
    };
    setContractItems();
    console.log(lotteryContract);
      
  }, [web3, lottery_address, lottery_abi]);
  const refreshPlayers = async () => {
    const players = await lotteryContract.contract.methods.getPlayers().call();
    setTimeout(() =>{
      setLotteryContract({...lotteryContract, players: players});
      console.log(lotteryContract.players);
    }, 10000);
  }

  const doBet = async () => {
    const finalBet = (bet / 100).toString();
    lotteryContract.contract.methods.setPlayers().send({from: account, value: web3.utils.toWei(finalBet, 'ether')});
    setLotteryContract({...lotteryContract, players: await lotteryContract.contract.methods.getPlayers().call()});
    console.log(lotteryContract.players);
    refreshPlayers();
  };

  const voteInMeForManager = async () => {
    await lotteryContract.contract.methods.setManager().send({from: account});
    setLotteryContract({...lotteryContract, manager: account});
    console.log(lotteryContract.manager);
  };

  const chooseWinner = async () => {
    await lotteryContract.contract.methods.setWinner().send({from: account});
    setLotteryContract({...lotteryContract, winner: account});
    console.log(lotteryContract.winner);
  };


  return (
    <div>
      <Head>
        <title>ETH Lottery</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack justify="center" boxShadow="lg" align="center" m="auto">
        <Flex direction="column" justify="space-around" w="100%" p={5}>
        <Flex justify="space-around">
          
            <Box as="p" w="20%" textAlign="right">
              {account ? `ballance: ${balance}` : 'connect your wallet'}
            </Box>
            <HStack spacing={8} w="20%">
            <Button onClick={() => {voteInMeForManager()}} colorScheme="telegram" w="100%">Set Manager</Button>
            <Button onClick={() => {chooseWinner()}} colorScheme="whatsapp" w="100%">Set Winner</Button>
            </HStack>
            <Box as="p" w="22%" textAlign="right">
              {account ? `address: ${account}` : 'connect your wallet'}
            </Box>
          </Flex>
          <VStack>
          <Box as="h1" fontSize="5xl" m="auto" fontWeight="bold" textAlign="center">
            ETH Lottery
          </Box>
          {active && 
          <>
          <Box as="h2" colorScheme="messenger" boxShadow="xl" border="5px solid #cbb02f" p={5} rounded="xl" fontSize="3xl" m="auto" fontWeight="bold" textAlign="center">
            Total Money in the pot: {lotteryContract.balance} ETH
          </Box>
          <Box as="h2" colorScheme="messenger" boxShadow="xl" border="5px solid #cbb02f" p={5} rounded="xl" fontSize="3xl" m="auto" fontWeight="bold" textAlign="center">
            Winner: {lotteryContract.winner ? lotteryContract.winner : 'No winner yet'}
          </Box>
          <Box as="h2" colorScheme="messenger" boxShadow="xl" border="5px solid #cbb02f" p={5} rounded="xl" fontSize="3xl" m="auto" fontWeight="bold" textAlign="center">
            {lotteryContract.players ? `Players: ${lotteryContract.players.length}` : 'Loading...'}
          </Box>
          <Box as="h2" colorScheme="messenger" boxShadow="xl" border="5px solid #cbb02f" p={5} rounded="xl" fontSize="3xl" m="auto" fontWeight="bold" textAlign="center">
            {lotteryContract.players ? `Manager: ${lotteryContract.manager}` : 'Loading...'}
          </Box>
          <FormControl w="50%">
            <VStack spacing={10}>
            <FormLabel htmlFor='amount'>Enter Your Bet (gwei)</FormLabel>
            <NumberInput max={100} min={1} value={bet}  w="100%" onChange={(e) => {setBet(e)}}>
              <NumberInputField id='amount' />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text>Total in Ether: {bet/100}</Text>
            <Button onClick={() => {doBet()}} colorScheme="telegram" w="100%">Bet</Button>
            </VStack>
          </FormControl>
          </>
          }
          </VStack>
          
        </Flex>
        
        <Flex justify="center" align="center" p={5}>
          <Button colorScheme="messenger" onClick={connectWallet}>
            {active ? 'Disconnect your wallet' : 'Connect your wallet'}
          </Button>
        </Flex>
        </Stack>
    </div>
  )
}


//get server side props 
export async function getServerSideProps() {
  const address = process.env.LOTTERY_ADDRESS;
  const abi = process.env.LOTTERY_ABI;

  return {
    props: {
      lottery_address: address,
      lottery_abi: abi,
    }
  }
}