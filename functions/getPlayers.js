const getPlayers = async (contract) => {
    const players = await contract.methods.getPlayers().call();
    return players.length;
}

export default getPlayers;