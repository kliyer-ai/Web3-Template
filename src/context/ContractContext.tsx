import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONFIG } from '../config'
import contract from './Contract'
import { useWeb3 } from "./Web3Context";


interface IContractContext {
    contractRead: ethers.Contract | undefined,
    contractWrite: ethers.Contract | undefined,
    svgs: string[] | undefined,
    getAllSvgs: () => void,
}

const ContractContext = createContext<IContractContext>({} as IContractContext);

const ContractProvider = ({ children }: { children: React.ReactNode }) => {
    const [contractWrite, setContractWrite] = useState<ethers.Contract>()
    const [contractRead, setContractRead] = useState<ethers.Contract>()
    const [svgs, setSvgs] = useState<string[]>()

    const { provider, signer, isCorrectChain } = useWeb3()

    const getAllSvgs = async () => {
        console.log('good');
        const lastTokenId = await contractRead?.currentAmount()
        console.log(lastTokenId);
        console.log('bad');


        const promises = []
        for (let i = 1; i <= lastTokenId; i++) {
            console.log(i);

            promises.push(contractRead?.tokenURI(i))
        }
        const newSvgs = await Promise.all(promises)
        setSvgs(newSvgs)
        console.log(newSvgs);

    }


    useEffect(() => {
        console.log(CONFIG.CONTRACT_ADDRESS);
        console.log(contract.abi);

        if (!isCorrectChain()) return

        if (provider === undefined) return

        setContractRead(new ethers.Contract(
            CONFIG.CONTRACT_ADDRESS,
            contract.abi,
            provider
        ))

        if (signer === undefined) return

        setContractWrite(new ethers.Contract(
            CONFIG.CONTRACT_ADDRESS,
            contract.abi,
            signer
        ))

        getAllSvgs()

        console.log('prov sig changed');
    }, [])


    return (
        <ContractContext.Provider value={{
            contractRead,
            contractWrite,
            svgs,
            getAllSvgs,
        }}>
            {children}
        </ContractContext.Provider>
    )

}




const useContract = () => React.useContext(ContractContext)

export { ContractProvider, useContract }