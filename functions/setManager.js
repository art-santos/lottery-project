const setManager = async (account, contract) => {
    const manager = await contract.methods.manager().call();
    if(account === '0x0000000000000000000000000000000000000000'){
        return false;
    }else if (manager === account){
        return account;
    }
    else{
        contract.methods.setManager().send({from: account}).then(() => {
            return contract.methods.manager().call();
        });
    }
}

export default setManager;