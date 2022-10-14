import React, { useState, useEffect } from "react";
import "./App.css";
import { NameWalletType, TypeWindow } from "./types";
import metamask_img from "./images/metamask.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fewchaExt,
  metamaskLinkExt,
  metamaskLinkWeb,
  optionsToastify,
  optionsToastify2,
} from "./contants";
import icon_up_more from "./images/arrow-up-right-solid.svg";
import logo_fewcha from "./images/fewcha.jpeg";
import Web3 from "web3";

const App: React.FC = () => {
  const [nameWallet, setNameWallet] = useState<NameWalletType>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null | any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [time, setTime] = useState<any>(null);

  const hasFecha = (window as any).fewcha;
  console.log("hasFecha: ", hasFecha);

  const [showSuggest, setShowSuggest] = useState<boolean>(false);

  const [reload, setReload] = useState<boolean>(false);

  const ethereum = (window as any).ethereum;

  function detectCurrentProvider() {
    let provider;
    if (ethereum) {
      provider = ethereum;
    } else if ((window as any).web3) {
      provider = (window as any).web3.currentProvider;
    } else {
      console.log("------> YOU NEED INSTALL METAMASK EXTENSION ------>");
    }
    return provider;
  }

  const handleConnectMetamask = async () => {
    const currentProvider = detectCurrentProvider();
    console.log("currentProvider: ", currentProvider);

    setReload(true);
    if (currentProvider) {
      if (nameWallet === "fewcha") handleDisconnectFewcha();
      try {
        const res = await ethereum.request({ method: "eth_requestAccounts" });
        console.log("result connect: ", res);
        const web3 = new Web3(currentProvider);

        const userAccount = await web3.eth.getAccounts();
        console.log("userAccount:", userAccount);
        const account = userAccount[0];
        setAddress(account);

        const balance = await web3.eth.getBalance(account);
        console.log("balance: ", balance);
        setBalance(Number(balance));

        setIsConnected(true);
        if (account) {
          toast("Connect Metamask successfully!", optionsToastify);
        }
        setNameWallet("metamask");
      } catch (error) {
        console.log("error: ", error);
      }
    } else {
      toast(
        "You have not installed because hey, you will be redirected to the settings page",
        optionsToastify
      );
      setTimeout(() => {
        window.open(metamaskLinkExt, "_blank");
      }, 3000);
    }
  };

  const handleDisconnectMetamask = () => {
    toast("Disconnect Metamask!", optionsToastify);
    setIsConnected(false);
    setAddress(null);
    setBalance(null);
    setNameWallet(null);
  };

  useEffect(() => {
    const timeId = setInterval(() => {
      const date = new Date().toLocaleString();
      setTime(date);
    }, 1000);
    return () => clearInterval(timeId);
  }, []);
  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  const truncateEthAddress = (address: string | null) => {
    const match = address?.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}...${match[2]}`;
  };

  async function handleInstallOrConnectFewcha() {
    if (hasFecha) {
      if (nameWallet === "metamask") {
        handleDisconnectMetamask();
      }
      try {
        const res = await (window as any)?.fewcha.connect();
        console.log("res: ", res);

        if (res.status) {
          setIsConnected(true);
          if (res.data.address) {
            setAddress(res.data.address);
            toast("Connect Fewcha successfully ", optionsToastify);
          } else {
            toast(
              "Click on the Extension, then log out and reload the browser",
              optionsToastify2
            );
          }
          setNameWallet("fewcha");
        }
        const balance = await (window as any).fewcha.getBalance();
        console.log("balance: ", balance);
        if (balance.status === 200) {
          const key = Object.keys(balance.data)[0];
          const value = balance.data[key];
          console.log("value: ", value);
          setBalance((value: any) => {
            if (!value) {
              return 0;
            } else {
              return value;
            }
          });
        } else {
          setBalance(0);
        }
      } catch (error) {}
    } else {
      window.open(fewchaExt, "_blank");
    }
  }

  async function handleDisconnectFewcha() {
    const res = await (window as any).fewcha.disconnect();
    console.log("res: ", res);
    if (res.status === 200) {
      toast("DisConnect Fewcha successfully ", optionsToastify);
      if (nameWallet === "fewcha") {
        setNameWallet(null);
        setAddress(null);
        setBalance(null);
        setIsConnected(false);
      }
    }
  }

  return (
    <div className="flex bg-[#dfe6e9] h-[100vh]  ">
      <div className="content m-auto">
        <p className="mb-10  text-[16px] text-[#34495e] italic">{time}</p>

        {!showSuggest ? (
          <div>
            <h3 className=" text-center mb-3 text-2xl">
              <a
                href={metamaskLinkWeb}
                target="_blank"
                className="relative hover:underline"
                title="Go to Metamask website"
              >
                <p className="title">Metamask Wallet </p>
                <img
                  className="absolute top-[2px] right-[103px]"
                  src={icon_up_more}
                  alt="Go to Webiste metamask wallet"
                />
              </a>

              <p className="text-sm italic">
                Warning Network: Testnet (Do not use Mainnet)
              </p>
            </h3>
            <img
              src={metamask_img}
              className="max-w-[450px] h-auto rounded-md"
              alt="Metamask"
            />
            <div>
              {isConnected && nameWallet === "metamask" ? (
                <div>
                  <p className="mt-4 mb-3">
                    <strong>
                      Address: <code>{address}</code>
                    </strong>
                  </p>
                  <p>
                    <strong>
                      Balance: <code>{balance}</code>
                    </strong>
                  </p>
                  <button
                    onClick={handleDisconnectMetamask}
                    className="btn btn-dis hover:bg-[#bd9710]"
                  >
                    Disconnect Metamask
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={handleConnectMetamask}
                    className="!mt-6 btn btn-connect"
                  >
                    <span>{ethereum ? "Connect " : "Install "}</span>
                    Metamask Wallet
                  </button>
                  {!ethereum && (
                    <p className="mt-4 text-center italic">
                      After installed, please
                      <span
                        className="px-1 font-bold underline text-blue-500 hover:cursor-pointer hover:text-red-500 "
                        title="Reload Page"
                        onClick={() => {
                          window.location.reload();
                        }}
                      >
                        reload
                      </span>
                      this site
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="suggestion mt-5">
            {showSuggest && (
              <div className="mt-1 border border-blue-500 px-4 max-w-[480px] py-3 rounded-md bg-white">
                <div className="flex items-center gap-x-1.5 mb-3">
                  <img
                    src={logo_fewcha}
                    className="w-[24px] h-[24px] rounded-full"
                    alt="Fewcha"
                  />
                  <p className="font-medium">
                    Fewcha Wallet - a product of Apps Cyclone Company
                  </p>
                </div>
                <p>
                  <strong className="pr-1">Status:</strong> Testnest
                </p>
                <p className="my-2">
                  <strong className="pr-1">Docs:</strong>
                  <a
                    href="https://docs.fewcha.app/"
                    className="hover:underline hover:text-blue-500"
                    target="_blank"
                    title="Fewcha Docs"
                  >
                    https://docs.fewcha.app/
                  </a>
                </p>
                <p className="mb-3">
                  <strong className="pr-1">NPM:</strong>
                  <a
                    href="https://www.npmjs.com/package/@fewcha/web3"
                    target="_blank"
                    title="NPM fewcha web3"
                    className="hover:underline hover:text-blue-500"
                  >
                    @fewcha/web3
                  </a>
                </p>
                <p>
                  After the installation is done, create an account,click on
                  fewcha extension and create an account this is very simple,
                  for the network, the advice is to choose Aptos Devnet. Click
                  faucet to get Balance free.
                </p>
                <p className="italic my-2">
                  Please install and rate us 5 *, thanks you
                </p>
                {nameWallet === "fewcha" && isConnected ? (
                  <div>
                    <p className="mt-4 mb-3">
                      <strong>
                        Address:
                        <code>
                          {address
                            ? truncateEthAddress(address)
                            : " No address"}
                        </code>
                      </strong>
                    </p>
                    <p>
                      <strong>
                        Balance: <code>{balance}</code>
                      </strong>
                    </p>
                    {!balance && (
                      <p className="text-red-500 italic">
                        Fewcha Error: Click on the Extension on Chrome, then
                        logout and reload the browser
                      </p>
                    )}
                    <button
                      onClick={handleDisconnectFewcha}
                      className="btn btn-dis !mt-4 hover:bg-[#bd9710]"
                    >
                      Disconnect Fewcha Wallet
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn !my-3"
                    onClick={handleInstallOrConnectFewcha}
                  >
                    <span>{hasFecha ? "Connect " : "Install"}</span> Fewcha
                    Wallet
                  </button>
                )}

                {!hasFecha && (
                  <p className="mt-4 text-center italic">
                    After installed, please
                    <span
                      className="px-1 font-bold underline text-blue-500 hover:cursor-pointer hover:text-red-500 "
                      title="Reload Page"
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      reload
                    </span>
                    this site
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        <p
          className="font-bold underline hover:cursor-pointer hover:text-blue-500 mt-3"
          onClick={() => setShowSuggest((prev) => !prev)}
        >
          {showSuggest ? "Close Suggest" : "Suggest"}
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
