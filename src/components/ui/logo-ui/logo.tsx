"use client";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <div
        className="text-lg lg:text-2xl font-extrabold text-gray-200"
        title="Batch transfer transactions up to 22 transfers in one transactions"
      >
        Batch Transactions
      </div>
    </Link>
  );
};

export default Logo;
