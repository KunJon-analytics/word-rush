import { Info } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";

interface StatsPopoverProps {
  hunters: number;
  attempts: number;
  winner: string;
  start: string;
}

const StatsPopover = ({
  hunters,
  attempts,
  winner,
  start,
}: StatsPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex-col space-y-2">
        <div className="flex justify-between w-full space-x-1">
          <div className="flex -space-x-px">
            <a
              href="#"
              className="tag rounded-r-none bg-green-600/10 text-green-600 hover:bg-green-600/20 focus:bg-green-600/20 active:bg-green-600/25"
            >
              Hunters
            </a>
            <a
              href="#"
              className="badge bg-green-600 text-white shadow-lg shadow-green-600/50"
            >
              {hunters}
            </a>
          </div>
          <div className="flex -space-x-px">
            <a
              href="#"
              className="tag rounded-r-none bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 focus:bg-blue-600/20 active:bg-blue-600/25"
            >
              Attempts
            </a>
            <a
              href="#"
              className="badge bg-blue-600 text-white shadow-lg shadow-blue-600/50"
            >
              {attempts}
            </a>
          </div>
        </div>
        <div className="flex justify-between w-full space-x-1">
          <div className="flex -space-x-px">
            <a
              href="#"
              className="tag rounded-r-none bg-pink-600/10 text-pink-600 hover:bg-pink-600/20 focus:bg-pink-600/20 active:bg-pink-600/25"
            >
              Winner
            </a>
            <a
              href="#"
              className="badge bg-pink-600 text-white shadow-lg shadow-pink-600/50"
            >
              {winner || "No winner"}
            </a>
          </div>
          <div className="flex -space-x-px">
            <a
              href="#"
              className="tag rounded-r-none bg-purple-600/10 text-purple-600 hover:bg-purple-600/20 focus:bg-purple-600/20 active:bg-purple-600/25"
            >
              Hunt Start
            </a>
            <a
              href="#"
              className="badge bg-purple-600 text-white shadow-lg shadow-purple-600/50"
            >
              {start}
            </a>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StatsPopover;
