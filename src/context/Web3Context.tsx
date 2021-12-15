import React, { createContext, useState } from "react";
import { ethers } from "ethers";
import { CONFIG } from '../config'


interface IWeb3Context {
    address: string,
    provider: ethers.providers.Web3Provider | undefined,
    signer: ethers.providers.JsonRpcSigner | undefined,
    chainId: number,
    loginMetamask: () => void,
    switchToEthereum: () => void,
    isCorrectChain: () => boolean,
}

const Web3Context = createContext<IWeb3Context>({} as IWeb3Context);


const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    const [address, setAddress] = useState('')
    const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>()
    const [chainId, setChainId] = useState(0)
    const [loggedIn, setLoggedIn] = useState(false)
    const [ethereum, setEthereum] = useState<any>()





    const loginMetamask = () => {
        const ethereum = (window as any).ethereum;
        if (!ethereum) {
            console.error('MetaMask not installed');
            return;
        }
        setEthereum(ethereum)

        setProvider(new ethers.providers.Web3Provider(ethereum))
        console.log('provider', provider);
        setSigner(provider?.getSigner())
        console.log('signer', signer);

        ethereum.request({ method: 'eth_requestAccounts' })
            .then((result: string[]) => {
                console.log('result', result);

                if (result && result.length > 0) {
                    setAddress(result[0].toLowerCase())
                    console.log('ethaddress', address);
                } else {
                    console.error('MetaMask login failed');
                }
            })

        ethereum.request({ method: 'eth_chainId' })
            .then((result: string) => {

                const id = parseInt(result, 16)
                console.log('chainId', result, id);
                setChainId(id)

            })


        ethereum.on('accountsChanged', (accounts: string[]) => {
            setAddress(accounts[0])
            // Handle the new accounts, or lack thereof.
            // "accounts" will always be an array, but it can be empty.
        });

        ethereum.on('chainChanged', (chainId: string) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.
            window.location.reload();
        });

        localStorage.setItem('metamaskAvailable', 'true');
        setLoggedIn(true)

    }

    const switchToEthereum = async () => {
        const chainId = `0x${Number(CONFIG.DEV ? CONFIG.DEV_CHAIN_ID : CONFIG.MAIN_CHAIN_ID).toString(16)}`
        const params = [{ chainId }]

        try {
            await ethereum?.request({
                method: 'wallet_switchEthereumChain',
                params
            });
        }
        // option to add a chain
        catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await ethereum.request({
                        chainId: '0x89',
                        chainName: 'Polygon',
                        rpcUrls: [
                            // 'https://rpc-mainnet.matic.network/',
                            'https://rpc-mainnet.maticvigil.com/',
                            'https://rpc-mainnet.matic.quiknode.pro'
                        ],
                        nativeCurrency: {
                            name: 'Matic Token',
                            symbol: 'MATIC',
                            decimals: 18
                        }
                    });
                } catch (addError) {
                    // handle "add" error
                }
            }
            // handle other "switch" errors
        }
    }



    const isCorrectChain = () => {
        const supposedChainId = CONFIG.DEV ? CONFIG.DEV_CHAIN_ID : CONFIG.MAIN_CHAIN_ID
        return supposedChainId === chainId
    }

    const metaMaskAvailable = localStorage.getItem('metamaskAvailable');
    if (metaMaskAvailable && !loggedIn) loginMetamask();


    return (
        <Web3Context.Provider value={{
            address,
            provider,
            signer,
            chainId,
            loginMetamask,
            switchToEthereum,
            isCorrectChain,
        }}>
            {children}
        </Web3Context.Provider>
    )

}

const useWeb3 = () => React.useContext(Web3Context)

export { Web3Provider, useWeb3 }