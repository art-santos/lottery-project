import convertToJson from './convertToJson';

const getContract = async (web3, lottery_address, lottery_abi) => {
    const abi = await convertToJson(lottery_abi);
    if(window.ethereum) {
        const contract = new web3.eth.Contract(abi, lottery_address);
        return contract
    }
};

export default getContract;