import { ToastOptions } from 'react-toastify';
import { TypeLink } from './types';
export const metamaskLinkWeb:TypeLink = "https://metamask.io/";
export const metamaskLinkExt: TypeLink =
  "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=vi";

export const fewchaApp: TypeLink = "https://fewcha.app/"; 
export const fewchaExt: TypeLink =
  "https://chrome.google.com/webstore/detail/fewcha-aptos-wallet/ebfidpplhabeedpnhjnobghokpiioolj";

export const optionsToastify: ToastOptions<{}> = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  type: "success",
}; 

export const optionsToastify2: ToastOptions<{}> = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  type: "error",
}; 