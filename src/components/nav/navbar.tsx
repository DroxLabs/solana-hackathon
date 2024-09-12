import React from "react";
import NavMenu from "./nav-menu";
import Logo from "@/components/ui/logo-ui/logo";
import WalletNetworkButton from "../solana-wallet/wallet-network-dropdown";

const Navbar = () => {
  return (
    <nav className="flex flex-row justify-between px-10 py-5 text-white p-4 sticky top-0 z-10">
      <div className="flex flex-row gap-10 items-center">
        <Logo />
        <NavMenu />
      </div>
      <div>
        {/* <WalletConnectButton /> */}
        <WalletNetworkButton />
      </div>
    </nav>
  );
};

export default Navbar;
