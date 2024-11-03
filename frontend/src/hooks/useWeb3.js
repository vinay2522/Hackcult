// src/hooks/useWeb3.js
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Evidence from '../contracts/Evidence.json';  // Make sure this path is correct

const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          const accounts = await web3Instance.eth.getAccounts();
          
          // Create contract instance
          const contractInstance = new web3Instance.eth.Contract(
            Evidence.abi,
            process.env.REACT_APP_CONTRACT_ADDRESS // Make sure to set this in your .env file
          );

          setWeb3(web3Instance);
          setContract(contractInstance);
          setAccount(accounts[0]);
          setLoading(false);
        } else {
          throw new Error('Please install MetaMask!');
        }
      } catch (err) {
        console.error('Error initializing web3:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initWeb3();
  }, []);

  return { web3, contract, account, loading, error };
};

export default useWeb3;