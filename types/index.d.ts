import type { Icon } from "lucide-react";
import { IronSession } from "iron-session";

import { Icons } from "@/components/shared/icons";
import { SessionData } from "@/lib/session";
import { ActivityGuess, Prisma } from "@prisma/client";

declare global {
  interface Window {
    Pi: any;
  }
}

export type MyPaymentMetadata = {};

export type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};

export type User = AuthResult["user"];

export type SubscribeTx = { subscriber: string };

export type DonateTx = { donor: string };

export interface PiCallbacks<T> {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => Promise<AxiosResponse<any, any>>;
  onError: (error: Error, payment?: PaymentDTO<T>) => void;
}

export interface PaymentDTO<T> {
  amount: number;
  user_uid: string;
  created_at: string;
  identifier: string;
  metadata: T;
  memo: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  to_address: string;
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type DefaultConfig = {
  mainNav: MainNavItem[];
};

export type SessionUser = Pick<
  IronSession<SessionData>,
  "accessToken" | "isLoggedIn" | "profileId" | "username" | "uuid"
>;

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type PropertyConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type WordleColor = "grey" | "yellow" | "green";

export type FormattedGuess = {
  key: string;
  color: string;
};

export type UsedKeys = {
  [k: string]: string;
};

export type FormatGuessInput = {
  color: string;
  guess: string;
};

export type FormatGuess = (input: ActivityGuess) => FormattedGuess[];

export type GetUsedKeys = (input: (FormattedGuess[] | undefined)[]) => UsedKeys;

export type FormatGuesses = (
  input: ActivityGuess[]
) => (FormattedGuess[] | undefined)[];

export type AddNewGuessInput = FormatGuessInput & {
  formattedGuess: FormattedGuess[];
  guesses: (FormattedGuess[] | undefined)[];
  turn: number;
  usedKeys: UsedKeys;
  history: string[];
};

export type AddNewGuessOutput = {
  isCorrect: boolean;
  turn: number;
  guesses: (FormattedGuess[] | undefined)[];
  usedkeys: UsedKeys;
  history: string[];
};

export type AddNewGuess = (input: AddNewGuessInput) => AddNewGuessOutput;

export type GameReturnType = Prisma.HunterActivityGetPayload<{
  include: {
    guesses: true;
    round: {
      select: {
        _count: true;
        createdAt: true;
        id: true;
        stage: true;
        updatedAt: true;
        winner: { select: { username: true } };
      };
    };
  };
}>;

export type MeReturnType = Prisma.UserGetPayload<{
  include: {
    activities: { include: { guesses: true; round: true } };
    _count: true;
  };
}>;
