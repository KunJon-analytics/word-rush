import type { Icon } from "lucide-react";
import { IronSession } from "iron-session";

import { Icons } from "@/components/shared/icons";
import { SessionData } from "@/lib/session";

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

export type SubscribeTx = { subscriptionId: string };

export interface PiCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => Promise<AxiosResponse<any, any>>;
  onError: (error: Error, payment?: PaymentDTO<SubscribeTx>) => void;
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
