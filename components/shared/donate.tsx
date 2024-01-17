import { Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getSession } from "@/actions/session";
import { DonateForm } from "./donate-form";

export async function DonateDialog() {
  const { username: donor } = await getSession();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Coins className="mr-2 h-4 w-4" /> Support
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Support Word Rush</DialogTitle>
          <DialogDescription>
            Support Word Rush! Enter the amount of Pi you&apos;d like to
            contribute to boost our game.
          </DialogDescription>
        </DialogHeader>
        <DonateForm donor={donor} />
      </DialogContent>
    </Dialog>
  );
}
