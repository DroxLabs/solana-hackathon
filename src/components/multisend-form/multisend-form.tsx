import React from "react";
import { Button } from "@/components/ui/button";
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

const MultisendForm = () => {
  return (
    <div className="flex flex-col gap-8 ">
      <div>
        <Label htmlFor="text" className="text-lg font-bold">
          Token Type
        </Label>
        <Select>
          <BorderWrapper>
            <SelectTrigger className="rounded-none w-[80vw] md:w-[800px] border-0 text-xl">
              <SelectValue placeholder="Please Select Token Type" />
            </SelectTrigger>
          </BorderWrapper>
          <SelectContent>
            <SelectItem value="light">SOL</SelectItem>
            <SelectItem value="dark">SPL Token</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="text" className="text-lg font-bold">
          Token Address
        </Label>
        <BorderWrapper>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            className="border-0 rounded-none text-xl"
          />
        </BorderWrapper>
      </div>
      <div>
        <Label htmlFor="text" className="text-lg font-bold">
          List Of addresses in CSV
        </Label>
        <CodeMirrorEditor />
      </div>
      <div className="w-2/4 self-center">
        <BorderWrapper>
          <Button className="border-0 bg-[#0A3E50] hover:bg-primary-network rounded-none w-full py-6 text-xl font-bold">
            Proceed
          </Button>
        </BorderWrapper>
      </div>
    </div>
  );
};

export default MultisendForm;
