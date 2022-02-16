import Web3 from 'web3';

const getMetamaskAccount = async () => {
    if(window.ethereum) {
       const web3 = new Web3(window.ethereum);
       const accounts = await web3.eth.getAccounts();
       return accounts;
    }
}

export default getMetamaskAccount;