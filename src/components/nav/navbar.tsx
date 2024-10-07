"use client";

import React, { useState } from "react";
import NavMenu from "./nav-menu";
import Logo from "@/components/ui/logo-ui/logo";
import WalletNetworkButton from "../solana-wallet/wallet-network-dropdown";
import { WalletButton } from "../solana-wallet/wallet-button";
import Link from "next/link";
import cs from "classnames";
import { useOnTop } from "../../services/use-on-top";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOnTop } = useOnTop();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <nav
      className={cs(
        "flex flex-row justify-between px-10 py-5 text-white p-4 sticky top-0 z-10",
        !isOnTop ? "bg-transparent" : "bg-[#01131A]"
      )}
    >
      <div className="flex flex-row gap-10 items-center">
        <Link href="/">
          <Logo />
        </Link>

        <div className="hidden lg:flex z-10">
          <NavMenu />
        </div>
      </div>
      <div className="flex flex-row gap-10 items-center">
        <WalletButton
          className="bg-primary-wallet py-2.5 px-5"
          labels={{
            connecting: "Connecting...",
            "has-wallet": "Connect",
            "no-wallet": "Connect",
            "copy-address": "Copy Address",
            copied: "Copied",
            "change-wallet": "Change Wallet",
            disconnect: "Disconnect",
          }}
        />
        <WalletNetworkButton className="bg-primary-network py-2.5 px-5 hidden lg:block" />
      </div>
      <button
        className=" lg:hidden"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          fill="#ffffff"
          width="30"
          height="30"
          viewBox="0 0 50 50"
        >
          <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
        </svg>
      </button>
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-black lg:hidden">
          <NavMenu />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
