import { create } from "zustand";
import { WorkerProfile, EmployerProfile } from "../types";

interface ProfileState {
  workerProfile: WorkerProfile | null;
  employerProfile: EmployerProfile | null;
  setWorkerProfile: (p: WorkerProfile | null) => void;
  setEmployerProfile: (p: EmployerProfile | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  workerProfile: null,
  employerProfile: null,
  setWorkerProfile: (p) => set({ workerProfile: p }),
  setEmployerProfile: (p) => set({ employerProfile: p }),
}));
