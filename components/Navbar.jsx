import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UDomain from './UDomain';
import Image from 'next/image';
import {ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "./Wallet"

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, WagmiConfig, createClient, goerli } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, polygonMumbai, optimismGoerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { BananaWallet } from "@rize-labs/banana-rainbowkit-plugin";




const Navbar = ({CreateProject, }) => {
  const { chains, provider } = configureChains(
    [polygonMumbai, optimismGoerli, goerli],
    [publicProvider()]
  );

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [
        BananaWallet({ chains, connect: { networkId: 81 } }),
        metaMaskWallet({ chains, shimDisconnect: true }),
        rainbowWallet({ chains }),
        walletConnectWallet({ chains }),
        injectedWallet({ chains, shimDisconnect: true }),
      ],
    },
  ]);

  //creating clients to use hooks of wagmi
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  });

  const [connectWallet, setConnectWallet] = useState("Connect Wallet");
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [navBg, setNavBg] = useState('#ecf0f3');
  const [linkColor, setLinkColor] = useState('#ecf0f3');
  const router = useRouter();

  useEffect(() => {
    if (
      router.asPath === '/createProject',
       router.asPath === '/faqSection' 
    ) {
      setNavBg('#ecf0f3');
      setLinkColor('#ecf0f3');
    } else {
      setNavBg('#ecf0f3');
      setLinkColor('#ecf0f3');
    }

    detectEthereumProvider().then((provider) => {
      provider.on("accountsChanged", accountChangeHandler);
      provider.on("chainChanged", chainChangedHandler);
    });
  }, [router]);

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const handleShadow = () => {
      if (window.scrollY >= 90) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };
    window.addEventListener('scroll', handleShadow);
  }, []);

  async function connectWalletButton() {
    var returnValue = await ConnectWalletHandler();
    setConnectWallet(returnValue[0]);
  }
  
  return (
    <div
      style={{ backgroundColor: `${navBg}` }}
      className={
        shadow
          ? "fixed w-full h-20  shadow-xl z-[100]"
          : "fixed w-full h-20  z-[100]"
      }
    >
      <div className='  items-center'>
       
        <div className='absolute   mx-10  items-center uppercase  w-full  '>
         
          <div className='relative top-6  mx-10  items-center uppercase  w-full '>
          
          
          <ul style={{ color: `${linkColor}` }} className='justify-start grid-cols-3 hidden md:flex'>

            <Link href='/'>
               
              <li className='ml-10 text-xl text-gray-900 uppercase hover:border-b'>Discover</li>
            </Link>
            <Link  href='/createProject'>
              <li className='ml-10 text-xl  text-gray-900 uppercase hover:border-b '>Create Project</li>
            </Link>
            

              <a href="https://medium.com/@decademia.info/list/f1bcd4d225f3">
              <li className='ml-10 text-xl  text-gray-900 uppercase hover:border-b '>Documentation </li>
              </a>

              <Link href='/faqSection'>
                <li className='ml-10 text-xl  text-gray-900 uppercase hover:border-b '>FAQ's</li>
              </Link>

          </ul>
          </div>

        </div>
              
        <div className='grid md:grid-cols-2 absolute ml-2 right-2 text-center bottom-5 '>
          <Link href='#/'>
            <div className=' text-sm uppercase '>
              <button className='p-2  shadow-none text-white underline-offset-auto' onClick={connectWalletButton}>
                <WagmiConfig client={wagmiClient}>
                  <RainbowKitProvider chains={chains}>
                    <Demo />
                  </RainbowKitProvider>
                </WagmiConfig>
              </button>

             
            </div>
          </Link>
        
          <Link href='#/'>
            <div className=' text-sm uppercase '>
            <UDomain />
              
            </div>
          </Link>
        </div>

     </div>
</div>

  );
};

export default Navbar;

