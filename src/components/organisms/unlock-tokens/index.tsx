"use client";

import gsap from "gsap";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { breakTheText } from "@/utils";
import { useRef, useState } from "react";
import showToast from "@/utils/show-toast";
import { useMediaQuery } from "react-responsive";
import { Section } from "@/components/templates";
import {
  ButtonSize,
  CONNECTION,
  PRIVATE_KEY,
  TitleSize,
  TOKEN_VESTING_PROGRAM_ID,
} from "@/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { signAndSendInstructions } from "@bonfida/utils";
import { Input, Title, Button } from "@/components/atoms";
import { createUnlockInstruction, getContractInfo } from "@/utils/vest";
import UNLOCK_BTN_LEFT_ICON from "@/assets/icons/unlock-btn-left-icon.webp";
import UNLOCK_BTN_RIGHT_ICON from "@/assets/icons/unlock-btn-right-icon.webp";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";

export default function SectionUnlockTokens() {
  /* MEDIA QUERIES */
  const showOnMobile = useMediaQuery({ query: "(max-width: 500px)" });

  /* STATES*/
  const unlockButtonRef = useRef<HTMLDivElement>(null);
  const unlockTokensTitle = useRef<HTMLHeadingElement>(null);

  const { publicKey } = useWallet();
  const [unlockTokenFields, setUnlockTokenFields] = useState<{
    seed: string;
    mintAddress: PublicKey | null;
  }>({
    seed: "",
    mintAddress: null,
  });

  /* HANDLERS */
  const onChangeUnlockTokenFields = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setUnlockTokenFields((prev) => ({
      ...prev,
      [name]: name === "mintAddress" ? new PublicKey(value) : value,
    }));
  };

  const validateUnlockTokenFields = (
    unlockTokenFields: any
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!unlockTokenFields.seed) {
      errors.push("Seed is required.");
    } else if (unlockTokenFields.seed.length < 32) {
      errors.push("Seed should be at least 32 characters long.");
    }

    if (
      !unlockTokenFields.mintAddress ||
      !PublicKey.isOnCurve(unlockTokenFields.mintAddress.toBytes())
    ) {
      errors.push("Invalid mint address.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  async function unlock(
    connection: Connection,
    programId: PublicKey,
    seedWord: Buffer | Uint8Array,
    mintAddress: PublicKey
  ): Promise<Array<TransactionInstruction>> {
    const { isValid, errors } = validateUnlockTokenFields(unlockTokenFields);

    if (!isValid) {
      errors.forEach((err) => showToast("error", err));
      // @ts-ignore
      return;
    }

    if (!publicKey) {
      showToast("error", "Connect Wallet!");
      // @ts-ignore
      return;
    }

    seedWord = seedWord.slice(0, 31);
    const [vestingAccountKey, bump] = await PublicKey.findProgramAddress(
      [seedWord],
      programId
    );
    seedWord = Buffer.from(seedWord.toString("hex") + bump.toString(16), "hex");

    const vestingTokenAccountKey = await getAssociatedTokenAddress(
      mintAddress,
      vestingAccountKey,
      true
    );

    const vestingInfo = await getContractInfo(connection, vestingAccountKey);

    const instruction = [
      createUnlockInstruction(
        programId,
        TOKEN_PROGRAM_ID,
        SYSVAR_CLOCK_PUBKEY,
        vestingAccountKey,
        vestingTokenAccountKey,
        vestingInfo.destinationAddress,
        [seedWord]
      ),
    ];

    const account = Keypair.fromSecretKey(new Uint8Array(PRIVATE_KEY));

    try {
      await signAndSendInstructions(CONNECTION, [], account, instruction);

      showToast("success", "Tokens unlocked");
      showToast("info", "Check your destination wallet");
    } catch (error) {
      showToast("error", "Error while unlocking the tokens");
    }

    return instruction;
  }

  /* animation */
  useGSAP(() => {
    if (unlockTokensTitle.current && unlockButtonRef) {
      const timeline = gsap.timeline();

      breakTheText(unlockTokensTitle.current);
      const unlockTokensTitleSpans =
        unlockTokensTitle.current.querySelectorAll("span");

      // Define animation properties
      const animation = {
        title: {
          target: unlockTokensTitleSpans,
          props: { opacity: 0, y: 50, stagger: 0 },
        },
        input: {
          target: ".__input__ img, .__input__ input, .__input__ div",
          props: { x: -60, opacity: 0, duration: 0.5 },
        },
        lockButton: {
          target: unlockButtonRef.current,
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
    <Section className="__unlock-tokens__ relative flex flex-col items-center pt-[70px]">
      <Title
        ref={unlockTokensTitle}
        size={showOnMobile ? TitleSize.H4 : TitleSize.H1}
        title="Unlock Tokens"
        className="uppercase text-center text-transparent bg-clip-text font-bold from-blue-to-lightblue text-shadow mt-[33.5px]"
      />

      <Input
        name="mintAddress"
        placeholder="Mint Address"
        inputContainerStyles="__input__ mt-[30px]"
        onChange={onChangeUnlockTokenFields}
      />
      <Input
        name="seed"
        placeholder="Seed"
        inputContainerStyles="__input__ mt-[30px]"
        onChange={onChangeUnlockTokenFields}
      />

      {/* Unlock Tokens */}
      <div
        ref={unlockButtonRef}
        className="btn__unlock-tokens flex items-center mt-[50px]"
        onClick={() =>
          unlock(
            CONNECTION,
            TOKEN_VESTING_PROGRAM_ID,
            Buffer.from(unlockTokenFields.seed),
            // @ts-ignore
            unlockTokenFields.mintAddress
          )
        }
      >
        <Image
          src={UNLOCK_BTN_LEFT_ICON}
          alt=""
          loading="lazy"
          className="w-[14px] h-[56px]"
        />
        <Button
          size={ButtonSize.LARGE}
          text="Unlock Tokens"
          className="uppercase font-[600] bg-[#4BBEE6] border border-[#4BBEE6]"
        />
        <Image
          src={UNLOCK_BTN_RIGHT_ICON}
          alt=""
          loading="lazy"
          className="w-[14px] h-[56px]"
        />
      </div>
    </Section>
  );
}
