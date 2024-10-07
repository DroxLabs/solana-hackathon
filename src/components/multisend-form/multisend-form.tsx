"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BorderWrapper from "../ui/button/border-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import {
  getTokenDecimal,
  isValidAccountAddress,
  parseAddresses,
} from "../../utils/solana-util";
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

type TokenType = TokenTypeEnum | null;
interface Props {
  tokenAddress: string;
  recipientAddresses: Array<RecipientAddressType>;
  recipientAddressString: string;
  tokenType: TokenType;
}

type ConfirmModal = {
  recipients: RecipientAddressType[];
  totalTransactions: number;
  totalAmount: number;
};

const MultisendForm = () => {
  const { connection } = useConnection();
  const [formData, setFormData] = useState<Props>({
    tokenAddress: "",
    recipientAddresses: [],
    recipientAddressString: "",
    tokenType: null,
  });
  const { openModal, closeModal } = useModal();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [tokenAddressErrorText, setTokenAddressErrorText] = useState("");

  const [recipientAddressesErrorText, setRecipientAddressesErrorText] =
    useState<Array<string>>([]);

  const [tokenTypeErrorText, setTokenTypeErrorText] = useState("");

  const { createAndTransferBatch } = useBatchTx();

  const handleValueChange = (key: keyof Props, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  useEffect(() => {
    setTokenAddressErrorText("");
    setTokenTypeErrorText("");
    setRecipientAddressesErrorText([]);
  }, [formData]);
  const ModalBody = (modalData: ConfirmModal) => {
    return (
      <>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-400">
            Review Transactions{" "}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-200">
            Total Transactions: {modalData.totalTransactions}
          </AlertDialogDescription>
          <AlertDialogDescription className="text-gray-200">
            Total Recipients: {`${modalData.recipients?.length}`}
          </AlertDialogDescription>
          <AlertDialogDescription className="text-gray-200">
            Total Token Amount: {`${modalData.totalAmount}`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeModal}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await createAndTransferBatch({
                recipients: modalData.recipients,
                mintAddress: formData.tokenAddress,
                tokenType: formData.tokenType,
              });
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </>
    );
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (formData.tokenType == null) {
        setTokenTypeErrorText("Please select a token type");
        throw "Please select a token type";
      }

      const { errors, recipients } = parseAddresses(
        formData.recipientAddressString
      );

      if (formData.tokenType == TokenTypeEnum.SPL) {
        if (!isValidAccountAddress(formData.tokenAddress)) {
          // openModal({
          //   modalType: "Error",
          //   modalNodeData: ModalBody("Invalid token address"),
          // });
          setTokenAddressErrorText("Invalid token address");
          throw errors[0];
        }
        const decimals = await getTokenDecimal(
          formData.tokenAddress,
          connection
        );

        if (!decimals) {
          // openModal({
          //   modalType: "Error",
          //   modalNodeData: ModalBody("Invalid token address"),
          // });
          setTokenAddressErrorText("Invalid token address");

          throw errors[0];
        }
      }

      if (errors.length > 0) {
        // openModal({ modalType: "Error", modalNodeData: ModalBody(errors[0]) });
        setRecipientAddressesErrorText(errors);
        throw errors[0];
      }

      const txData = {
        recipients,
        totalTransactions: recipients.length,
        totalAmount: recipients.reduce(
          (acc, recipient) => +recipient.amount + acc,
          0
        ),
      };
      openModal({
        modalType: "confirm-transfer",
        modalNodeData: ModalBody(txData),
      });

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
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
        <div
          className={`text-red-400 text-md transition-all duration-500 ease-in-out transform ${
            !!tokenTypeErrorText ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {tokenTypeErrorText}
        </div>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out transform ${
          formData.tokenType == TokenTypeEnum.SPL
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
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
        <div
          className={`text-red-400 text-md transition-all duration-500 ease-in-out transform ${
            !!tokenAddressErrorText
              ? "max-h-20 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          {tokenAddressErrorText}
        </div>
      </div>

      <div className=" min-h-[200px] max-w-[950px]">
        <Label htmlFor="text" className="text-lg font-bold">
          List Of addresses in CSV
        </Label>
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
        <div
          className={`text-red-400 text-md transition-all duration-500 ease-in-out transform ${
            recipientAddressesErrorText.length > 0
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          {recipientAddressesErrorText
            .slice(0, 5)
            .map((value: string, index: number) => (
              <div key={index}>{value}</div>
            ))}
        </div>
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
