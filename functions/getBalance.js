import Web3 from 'web3';

const getBalance = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const accounts = await web3.eth.getAccounts();
    const balance = await web3.eth.getBalance(accounts[0]);
    return web3.utils.fromWei(balance, 'ether');
}

export default getBalance;