"use client";

import gsap from "gsap";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import showToast from "@/utils/show-toast";
import Button from "@/components/atoms/button";
import { useMediaQuery } from "react-responsive";
import { Section } from "@/components/templates";
import { Title, Input } from "@/components/atoms";
import { CopyIcon } from "@/components/svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import { PublicKey, Transaction } from "@solana/web3.js";
import { breakTheText, Numberu64, Schedule } from "@/utils";
import {
  ButtonSize,
  CONNECTION,
  TitleSize,
  TOKEN_VESTING_PROGRAM_ID,
} from "@/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { create, generateRandomSeed } from "@/utils/vest";
import INPUT_LEFT_ICON from "@/assets/icons/input-left-vector.webp";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import INPUT_RIGHT_ICON from "@/assets/icons/input-right-vector.webp";
import GLOWING_VECTORS_ICON from "@/assets/icons/glowing-vectors.webp";
import LOCK_BTN_LEFT_ICON from "@/assets/icons/lock-btn-left-icon.webp";
import LOCK_BTN_RIGHT_ICON from "@/assets/icons/lock-btn-right-icon.webp";

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
    viewBox="0 0 24 24"
    width="24px"
    height="24px"
  >
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM19 20H5V9h14v11zM7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
  </svg>
);

export default function SectionLockTokens() {
  /* MEDIA QUERIES */
  const showOnMobile = useMediaQuery({ query: "(max-width: 500px)" });

  /* STATES*/
  const lockButtonRef = useRef<HTMLDivElement>(null);
  const lockTokensTitle = useRef<HTMLHeadingElement>(null);

  const [seed, setSeed] = useState<string>("");
  const { publicKey, sendTransaction } = useWallet();
  const [lockTokenFields, setLockTokenFields] = useState<{
    amount: number;
    mintAddress: PublicKey | null;
    destinationAddress: string;
    vestingScheduleDate: Date | null;
  }>({
    amount: 0,
    mintAddress: null,
    destinationAddress: "",
    vestingScheduleDate: null,
  });

  /* HANDLERS */
  const onChangeLockTokenFields = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setLockTokenFields((prev) => ({
      ...prev,
      [name]:
        name === "amount"
          ? Number(value)
          : name === "mintAddress"
          ? new PublicKey(value)
          : value,
    }));
  };

  const copySeed = async () => {
    if (seed) {
      await window.navigator.clipboard.writeText(seed);
    }
  };

  const validateLockTokenFields = (
    lockTokenFields: any
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (isNaN(lockTokenFields.amount) || lockTokenFields.amount <= 0) {
      errors.push("Amount must be a valid number.");
    }

    if (
      !lockTokenFields.mintAddress ||
      !PublicKey.isOnCurve(lockTokenFields.mintAddress.toBytes())
    ) {
      errors.push("Invalid mint address.");
    }

    try {
      new PublicKey(lockTokenFields.destinationAddress);
    } catch (e) {
      errors.push("Invalid destination address.");
    }

    if (
      lockTokenFields.vestingScheduleDate &&
      lockTokenFields.vestingScheduleDate.getTime() <= Date.now()
    ) {
      errors.push("Vesting schedule date must be in the future.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const lockTokens = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const { isValid, errors } = validateLockTokenFields(lockTokenFields);

    if (!isValid) {
      errors.forEach((err) => showToast("error", err));
      return;
    }

    const { value } =
      (await CONNECTION.getParsedAccountInfo(
        // @ts-ignore
        lockTokenFields.mintAddress,
        "confirmed"
      )) || {};

    if (!publicKey || !CONNECTION) {
      showToast("error", "Connect Wallet!");
      return;
    }

    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
      CONNECTION,
      // @ts-ignore
      publicKey,
      lockTokenFields.mintAddress,
      publicKey
    );

    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
      CONNECTION,
      // @ts-ignore
      publicKey,
      lockTokenFields.mintAddress,
      new PublicKey(lockTokenFields.destinationAddress)
    );

    const tokenInfo = await CONNECTION.getParsedAccountInfo(
      sourceTokenAccount.address,
      "confirmed"
    );

    if (!tokenInfo.value) {
      showToast("error", "Token account not found");
      return;
    }

    if (!tokenInfo.value || !("parsed" in tokenInfo.value.data)) {
      showToast("error", "Token parsed not found");
      return;
    }

    const parsed = tokenInfo.value.data.parsed;
    // @ts-ignore
    if (parsed.info.mint !== lockTokenFields.mintAddress.toBase58()) {
      showToast("error", "Mint mismatch");
      return;
    }
    if (parsed.info.owner !== publicKey.toBase58()) {
      showToast("error", "Owner mismatch");
      return;
    }
    if (parsed.info.tokenAmount.decimals === 0) {
      showToast("error", "Decimal mismatch");
      return;
    }

    let schedule = new Schedule(new Numberu64(0), new Numberu64(0));

    if (lockTokenFields.vestingScheduleDate) {
      schedule = new Schedule(
        /** Has to be in seconds */
        new Numberu64(lockTokenFields.vestingScheduleDate.getTime() / 1000),
        /** Don't forget to add decimals */
        new Numberu64(
          lockTokenFields.amount *
            // @ts-ignore
            Math.pow(10, value?.data?.parsed?.info?.decimals)
        )
      );
    }

    const seed = generateRandomSeed();

    const instruction = await create(
      CONNECTION,
      TOKEN_VESTING_PROGRAM_ID,
      Buffer.from(seed),
      publicKey,
      publicKey,
      sourceTokenAccount.address,
      destinationTokenAccount.address,
      // @ts-ignore
      lockTokenFields.mintAddress,
      [schedule]
    );

    try {
      const transaction = new Transaction().add(...instruction);
      await sendTransaction(transaction, CONNECTION);

      setSeed(seed);

      showToast("success", "Transaction successfull");
      showToast("success", "Copy your seed above");
    } catch (error) {
      showToast("error", "You may have insufficient funds");
      showToast("info", "Tokens are being used in transaction fees");
      showToast(
        "info",
        "Check your wallet must not have unknown while in transaction"
      );
    }
  };

  /* animation */
  useGSAP(() => {
    if (lockTokensTitle.current && lockButtonRef.current) {
      const timeline = gsap.timeline();

      breakTheText(lockTokensTitle.current);
      const lockTokensTitleSpans =
        lockTokensTitle.current.querySelectorAll("span");

      // Define animation properties
      const animation = {
        title: {
          target: lockTokensTitleSpans,
          props: { opacity: 0, y: 50, stagger: 0 },
        },
        input: {
          target: ".__input__ img, .__input__ input, .__input__ div",
          props: { x: -60, opacity: 0, duration: 0.5 },
        },
        lockButton: {
          target: lockButtonRef.current,
          props: { y: 60, opacity: 0, duration: 0.8 },
        },
      };

      // Add animation to timeline
      timeline.fromTo(animation.title.target, animation.title.props, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.1,
      });
      timeline.from(animation.input.target, animation.input.props);
      timeline.from(animation.lockButton.target, animation.lockButton.props);
    }
  });

  return (
    <Section className="__lock-tokens__ relative flex flex-col items-center pt-[70px]">
      <Title
        ref={lockTokensTitle}
        size={showOnMobile ? TitleSize.H4 : TitleSize.H1}
        title="Lock Tokens"
        className="uppercase text-center text-transparent bg-clip-text font-bold from-blue-to-lightblue text-shadow mt-[33.5px]"
      />

      {/* COPY BUTTON */}
      {seed && (
        <div className="w-[40%] flex items-center mt-5">
          <Image
            src={INPUT_LEFT_ICON}
            alt=""
            loading="lazy"
            className="w-[5px] h-[42px]"
          />
          <div
            onClick={copySeed}
            className=" w-full flex justify-between items-center border border-[#0A3E50] py-[10px] pl-4 pr-2 text-[13.5px] font-secondary truncate cursor-pointer focus:outline-none"
          >
            <span className="text-white text-sm">
              {seed.slice(0, 30) + "..." + seed.slice(-1)}
            </span>
            <CopyIcon className="w-[18px] h-[18px]" />
          </div>
          <Image
            src={INPUT_RIGHT_ICON}
            alt=""
            loading="lazy"
            className="w-[5px] h-[42px]"
          />
        </div>
      )}

      <Input
        name="destinationAddress"
        placeholder="Destination Address"
        inputContainerStyles="__input__ mt-[30px]"
        onChange={onChangeLockTokenFields}
      />
      <Input
        name="mintAddress"
        placeholder="Mint Address"
        inputContainerStyles="__input__ mt-[30px]"
        onChange={onChangeLockTokenFields}
      />
      <Input
        name="amount"
        placeholder="Amount"
        inputContainerStyles="__input__ mt-[30px]"
        onChange={onChangeLockTokenFields}
      />
      {/* Vesting Schedule Date */}
      <div className="__input__ lg:w-[40%] md:w-[60%] sm:w-[80%] max-sm:w-[80%] flex items-center mt-[30px]">
        <Image
          src={INPUT_LEFT_ICON}
          alt=""
          loading="lazy"
          className="w-[5px] h-[42px]"
        />
        <div
          className="vesting-schedule__input w-full flex items-center border border-[#0A3E50] py-[10px] pl-5 text-[13.5px] font-secondary focus:outline-none"
          style={{
            color: " rgba(255, 255, 255, 0.60)",
            background: "rgba(10, 43, 65, 0.20)",
          }}
        >
          <DatePicker
            name="vestingScheduleDate"
            selected={lockTokenFields.vestingScheduleDate}
            onChange={(date: Date | null) => {
              setLockTokenFields((prev) => ({
                ...prev,
                vestingScheduleDate: date,
              }));
            }}
            placeholderText="Vesting Schedule (Date)"
            className="__input__ bg-transparent text-[0.75rem] font-secondary leading-[1rem] w-full h-full outline-none caret-gray-400"
          />
          <CalendarIcon />
        </div>
        <Image
          src={INPUT_RIGHT_ICON}
          alt=""
          loading="lazy"
          className="w-[5px] h-[42px]"
        />
      </div>

      {/* Lock Tokens Button */}
      <div
        ref={lockButtonRef}
        className="btn__lock-tokens flex items-center mt-[50px]"
        onClick={lockTokens}
      >
        <Image
          src={LOCK_BTN_LEFT_ICON}
          alt=""
          loading="lazy"
          className="w-[14px] h-[58px]"
        />
        <Button
          size={ButtonSize.LARGE}
          text="Lock Tokens"
          className="uppercase font-[600] bg-[#0C7498] border border-[#0C7498]"
        />
        <Image
          src={LOCK_BTN_RIGHT_ICON}
          alt=""
          loading="lazy"
          className="w-[14px] h-[58px]"
        />
      </div>
      {/* <Image
        src={GLOWING_VECTORS_ICON}
        alt=""
        className="w-[600px] absolute left-0 top-[7%] translate-x-[-50%]"
        style={{
          zIndex: -1,
        }}
      />
      <Image
        src={GLOWING_VECTORS_ICON}
        alt=""
        className="w-[600px] z-[-1px] absolute right-0 -top-[20%] translate-x-[50%]"
        style={{
          zIndex: -1,
        }}
      /> */}
    </Section>
  );
}
