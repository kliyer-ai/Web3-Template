import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONFIG } from '../config'
import contract from './Contract'
import { useWeb3 } from "./Web3Context";


interface IContractContext {
    contractRead: ethers.Contract | undefined,
    contractWrite: ethers.Contract | undefined,
}

const ContractContext = createContext<IContractContext>({} as IContractContext);

const ContractProvider = ({ children }: { children: React.ReactNode }) => {
    const [contractWrite, setContractWrite] = useState<ethers.Contract>()
    const [contractRead, setContractRead] = useState<ethers.Contract>()

    const { provider, signer } = useWeb3()

    useEffect(() => {
        setContractWrite(new ethers.Contract(
            CONFIG.CONTRACT_ADDRESS,
            contract.abi,
            signer
        ))
        setContractRead(new ethers.Contract(
            CONFIG.CONTRACT_ADDRESS,
            contract.abi,
            provider
        ))
    }, [provider, signer])




    return (
        <ContractContext.Provider value={{
            contractRead,
            contractWrite
        }}>
            {children}
        </ContractContext.Provider>
    )

}




const useContract = () => React.useContext(ContractContext)

export { ContractProvider, useContract }