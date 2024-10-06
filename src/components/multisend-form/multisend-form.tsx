"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@solana/wallet-adapter-base";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodeMirrorEditor from "./CodeMirrorEditor";
import BorderWrapper from "../ui/button/border-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import {
  getTokenDecimal,
  isValidAccountAddress,
  parseAddresses,
} from "../../utils/solana-util";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import CodeMirror from "@uiw/react-codemirror";
import { RecipientAddressType, TokenTypeEnum } from "./type";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useBatchTx from "../../services/use-batch-tx";
import { useModal } from "../../context/modal.context";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";

interface Props {
  tokenAddress: string;
  recipientAddresses: Array<RecipientAddressType>;
  recipientAddressString: string;
  tokenType: TokenTypeEnum | null;
}

const MultisendForm = () => {
  const { connection } = useConnection();
  const [formData, setFormData] = useState<Props>({
    tokenAddress: "",
    recipientAddresses: [],
    recipientAddressString: "",
    tokenType: null,
  });
  const { connected, publicKey } = useWallet();
  const { openModal, closeModal } = useModal();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [tokenAddressErrorText, setTokenAddressErrorText] = useState("");

  const [recipientAddressesErrorText, setRecipientAddressesErrorText] =
    useState<Array<string>>([]);

  console.log("MultisendForm  formData:", formData);

  const { createAndTransferBatch } = useBatchTx();

  const handleValueChange = (key: keyof Props, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  useEffect(() => {
    setTokenAddressErrorText("");
    setRecipientAddressesErrorText([]);
  }, [formData]);
  const ModalBody = (modalData: string) => {
    return (
      <>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-400">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-200">
            {modalData}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeModal}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </>
    );
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const { errors, recipients } = parseAddresses(
        formData.recipientAddressString
      );

      if (!isValidAccountAddress(formData.tokenAddress)) {
        // openModal({
        //   modalType: "Error",
        //   modalNodeData: ModalBody("Invalid token address"),
        // });
        setTokenAddressErrorText("Invalid token address");
        throw errors[0];
      }
      const decimals = await getTokenDecimal(formData.tokenAddress, connection);

      if (!decimals) {
        // openModal({
        //   modalType: "Error",
        //   modalNodeData: ModalBody("Invalid token address"),
        // });
        setTokenAddressErrorText("Invalid token address");

        throw errors[0];
      }

      if (errors.length > 0) {
        // openModal({ modalType: "Error", modalNodeData: ModalBody(errors[0]) });
        setRecipientAddressesErrorText(errors);
        throw errors[0];
      }

      // openModal("confirm-transfer", {
      //   tokenAddress: formData.tokenAddress,
      //   recipientAddresses: formData.recipientAddresses,
      //   recipientAddressString: formData.recipientAddressString,
      //   tokenType: formData.tokenType,
      // });
      // await createAndTransferBatch({
      //   recipients,
      //   mintAddress: formData.tokenAddress,
      // });
      console.log("handleSubmit  recipients:", recipients);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleConfirmTx = (
    recipients: RecipientAddressType[],
    mintAddress: string
  ) => {
    createAndTransferBatch({
      recipients,
      mintAddress,
    });
  };

  const buttonText = isLoading ? "Proceeding..." : "Proceed";
  return (
    <div className="flex flex-col gap-8 ">
      <div>
        <Label htmlFor="text" className="text-lg font-bold">
          Token Type
        </Label>
        <Select
          onValueChange={(value: string) =>
            handleValueChange("tokenType", value)
          }
          key={"tokenType"}
        >
          <BorderWrapper>
            <SelectTrigger className="rounded-none border-0 text-xl">
              <SelectValue placeholder="Please Select Token Type" />
            </SelectTrigger>
          </BorderWrapper>
          <SelectContent>
            <SelectItem value={TokenTypeEnum.SOL}>SOL</SelectItem>
            <SelectItem value={TokenTypeEnum.SPL}>SPL Token</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="text" className="text-lg font-bold">
          Token Address
        </Label>
        <BorderWrapper>
          <Input
            type="text"
            id="tokenAddress"
            onChange={(e) => handleValueChange("tokenAddress", e.target.value)}
            placeholder="Token Address"
            className="border-0 rounded-none text-xl"
          />
        </BorderWrapper>
        {!!tokenAddressErrorText && (
          <div className="text-red-400 text-md">{tokenAddressErrorText}</div>
        )}
      </div>
      <div className=" min-h-[200px] max-w-[950px]">
        <Label htmlFor="text" className="text-lg font-bold">
          List Of addresses in CSV
        </Label>
        {/* <CodeMirrorEditor /> */}
        <BorderWrapper>
          <CodeMirror
            placeholder={`Add addresses like
7KvpRXpZ7hxjosYHd3j1sSw6wfU1E7xQF5cyQq7WC9Wf, 1
oPnvCUD3LhMUygUT1gbrdSb9ztNenWd9fhQeDvxhFDW, 2
FSCYWVmQxBv3GvP6XePyKuyVAvTpQr9q45hqqDW2KbRb, 1.5`}
            height="200px"
            width="70vw"
            maxWidth="900px"
            className="text-xl max-w-[900px]"
            theme="dark"
            onChange={(value: string) => {
              console.log("MultisendForm handleValueChange  value:", value);

              handleValueChange("recipientAddressString", value);
            }}
          />
        </BorderWrapper>
        {recipientAddressesErrorText.length > 0 && (
          <>
            {recipientAddressesErrorText.slice(0, 5).map((value: string) => (
              <div className="text-red-400 text-md">{value}</div>
            ))}
          </>
        )}
      </div>
      <div className="w-2/4 self-center">
        <BorderWrapper>
          <Button
            className="border-0 bg-[#0A3E50] hover:bg-primary-network rounded-none w-full py-6 text-xl font-bold"
            onClick={() => handleSubmit()}
            disabled={isLoading}
          >
            {buttonText}
          </Button>
        </BorderWrapper>
      </div>
    </div>
  );
};

export default MultisendForm;
