import { create } from "zustand";
import { TransactionResponse } from "ethers";
import { useFHEZamaTalkStore } from "./useFHEZamaTalkStore";

type UserProfile = {
  name: string;
  avatarUrl: string;
  createdAt: number;
  active: boolean;
};

type FHEZamaTalkLoginStore = {
  loading: boolean;
  error: string | null;
  profile: UserProfile | null;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  nameExists: (name: string) => Promise<boolean>;
  getProfile: () => Promise<UserProfile | null>;
  createProfile: (name: string, avatarUrl?: string) => Promise<void>;
};

export const useFHEZamaTalkLoginStore = create<FHEZamaTalkLoginStore>(
  (set, get) => ({
    error: null,
    loading: false,
    profile: null,

    setError: (error: string | null) => set({ error }),
    setLoading: (loading: boolean) => set({ loading }),
    setProfile: (profile: UserProfile | null) => set({ profile }),

    nameExists: async (name: string): Promise<boolean> => {
      const { contractView } = useFHEZamaTalkStore.getState();

      try {
        const exists: boolean = await contractView?.nameExists(name);
        set({ error: exists ? 'This name already exists.' : null });
        return exists;
      } catch (err) {
        console.error("Check name failed", err);
        return false;
      }
    },

    createProfile: async (name: string, avatarUrl: string = ""): Promise<void> => {
      const { contractTx } = useFHEZamaTalkStore.getState();
      set({ loading: true, error: null });

      try {
        const tx: TransactionResponse = await contractTx?.createProfile(
          name,
          avatarUrl
        );

        await tx.wait();

        set({ loading: false });
      } catch (err: any) {
        console.error("Create profile failed", err);
        set({ error: err?.message || "Unknown error", loading: false });
      }
    },

    getProfile: async (): Promise<UserProfile | null> => {
      const { contractTx } = useFHEZamaTalkStore.getState();

      try {
        const profile = await contractTx?.getProfile();

        const result: UserProfile | null = profile
          ? {
              name: profile.name ?? "",
              avatarUrl: profile.avatarUrl ?? "",
              createdAt: Number(profile.createdAt ?? 0),
              active: profile.active ?? false,
            }
          : null;

        set({ profile: result });
        return result;
      } catch (err) {
        console.error("Get profile failed", err);
        return null;
      }
    },
  })
);
