const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile");

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract", () => {

  it("Check if the lottery contract was deployed", () => {
    assert.ok(lottery.options.address);
  });

    it("Allows some users to enter", async () => {
        for (let i = 0; i < 10; i++){
            await lottery.methods.setPlayers().send({
                from: accounts[i],
                value: web3.utils.toWei("0.02", "ether")
            });
        }

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0],
        });

        for(let i=0; i<10; i++){
            assert.equal(accounts[i], players[i]);
        }
        
        assert.equal(10, players.length);
    });

    it("Requires a minimum amount of ether to enter (shall return an error)", async () => {
        let error = false;
        try{
        await lottery.methods.setPlayers().send({
            from: accounts[0],
            value: web3.utils.toWei("0.01", "ether")
        });
        }catch(err){
            error = true;
        }
        assert.equal(true, error);
    });

    it("Should set a manager an verify if the manager is the one who's setted", async () => {
        await lottery.methods.setManager().send({
            from: accounts[0]
        });

        const manager = await lottery.methods.manager().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], manager);
    });

    it("Requires that the manager is the one to set the winner (shall return error)", async () => {
        error = false;
        try{
        await lottery.methods.setWinner().send({
            from: accounts[1],
        });
        }catch(err){
            error = true;
        }
        assert.equal(true, error);
    });

    it("sends money to the winner then resets the players array", async () => {

        await lottery.methods.setManager().send({
            from: accounts[0]
        });

        for(let i = 0; i < 10; i++){
            await lottery.methods.setPlayers().send({
                from: accounts[i],
                value: web3.utils.toWei("1", "ether")
            });
        };

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.setWinner().send({
            from: accounts[0], 
            gas: "1000000"
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = initialBalance - finalBalance;

        assert.ok(difference < web3.utils.toWei('1', "ether"));
    });

    it("Should return the number of players (shall be none)", async () => {
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0],
        });

        assert.equal(0, players.length);
    })
});