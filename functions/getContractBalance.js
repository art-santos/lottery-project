import Web3 from 'web3';

const getContractBalance = async (contract) => {
    const web3 = new Web3(Web3.givenProvider);
    const balance = await web3.eth.getBalance(contract.options.address);
    return balance;
}

export default getContractBalance;