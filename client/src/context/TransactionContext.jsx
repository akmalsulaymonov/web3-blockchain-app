import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionContract;

    /*
    console.log({
        provider,
        signer,
        transactionsContract
    })
    */

};

export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount")); // store in local storage

    const handleChange = (e, name) => {
        setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
      };

    // check if connected
    const checkIfWalletIsConncted = async () => {
        try {
            if(!ethereum) return alert('Please install metamask!');
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            //console.log(accounts);
            if(accounts.length){
                setCurrentAccount(accounts[0]);

                // getAllTransactions();
            }
            else{
                console.log("No accounts found.");
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }        
    }

    // connect wallet - account
    const connectWallet = async () => {
        try {
            if(!ethereum) return alert('Please install metamask!');
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    // send transactions
    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert('Please install metamask!');
            const { addressTo, amount, keyword, message } = formData;   // get data from form
            const transactionsContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);   // utilit function
            
            // send eth
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208",    // 21000 GWEI
                    value: parsedAmount._hex,   // 0.00001
                }],
            });

            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);   // template string
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);

            const transactionsCount = await transactionsContract.getTransactionCount();

            setTransactionCount(transactionsCount.toNumber());
            window.location.reload();
            

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }


    // starts only onloading of app
    useEffect( () => {
        checkIfWalletIsConncted();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, handleChange, formData, sendTransaction }}>
            { children }
        </TransactionContext.Provider>
    )
}