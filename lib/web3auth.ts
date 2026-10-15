import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { FUJI, WEB3AUTH } from "./constants";

/**
 * Inicializa el cliente de Web3Auth para Avalanche Fuji.
 * La wallet embebida se asocia al correo del usuario; la clave privada nunca
 * se expone en la interfaz.
 *
 * Solo debe ejecutarse en el navegador.
 */
export function createWeb3Auth(): Web3Auth {
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: FUJI.chainIdHex,
    rpcTarget: FUJI.rpcUrl,
    displayName: FUJI.name,
    blockExplorerUrl: FUJI.explorerUrl,
    ticker: FUJI.currency.symbol,
    tickerName: FUJI.currency.name,
  };

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });

  return new Web3Auth({
    clientId: WEB3AUTH.clientId,
    web3AuthNetwork:
      WEB3AUTH.network === "sapphire_mainnet"
        ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
        : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
    uiConfig: {
      appName: "Gobernanza Residencial",
      mode: "light",
      defaultLanguage: "es",
      loginMethodsOrder: ["email_passwordless", "google"],
      logoLight: "/logo.svg",
      logoDark: "/logo.svg",
    },
  });
}
