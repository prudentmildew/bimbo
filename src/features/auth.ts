import type { StateCreator } from 'zustand';

export type UserRole =
  | 'user'
  | 'guest'
  | 'workflow_admin'
  | 'project_admin'
  | 'customer_admin'
  | 'owner';

export interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthSlice {
  currentUser: MockUser | null;
  registeredUsers: MockUser[];
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  deleteAccount: () => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
}

export async function hashPassword(password: string): Promise<string> {
  const encoded = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const ADMIN_ROLES: UserRole[] = [
  'owner',
  'customer_admin',
  'project_admin',
];

const ROLE_RANK: Record<UserRole, number> = {
  user: 0,
  guest: 0,
  workflow_admin: 1,
  project_admin: 2,
  customer_admin: 3,
  owner: 4,
};

export function canEditRole(
  editorRole: UserRole,
  targetCurrentRole: UserRole,
): boolean {
  const editorRank = ROLE_RANK[editorRole];
  if (editorRank < 2) return false; // non-admins can't edit
  if (editorRole === 'owner') return true;
  return ROLE_RANK[targetCurrentRole] < editorRank;
}

export function canAssignRole(
  editorRole: UserRole,
  newRole: UserRole,
): boolean {
  if (editorRole === 'owner') return true;
  return ROLE_RANK[newRole] < ROLE_RANK[editorRole];
}

export function assignableRoles(editorRole: UserRole): UserRole[] {
  return (['owner', 'customer_admin', 'project_admin', 'workflow_admin', 'user', 'guest'] as UserRole[]).filter(
    (role) => canAssignRole(editorRole, role),
  );
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  currentUser: null,
  registeredUsers: [],

  signUp: async (email, password, firstName, lastName) => {
    const existing = get().registeredUsers.find((u) => u.email === email);
    if (existing) return { ok: false, error: 'Email already registered' };

    const passwordHash = await hashPassword(password);
    const isFirstUser = get().registeredUsers.length === 0;

    const user: MockUser = {
      id: crypto.randomUUID(),
      email,
      passwordHash,
      firstName,
      lastName,
      role: isFirstUser ? 'owner' : 'user',
      createdAt: new Date().toISOString(),
    };

    set((s) => ({
      currentUser: user,
      registeredUsers: [...s.registeredUsers, user],
    }));
    return { ok: true };
  },

  signIn: async (email, password) => {
    const user = get().registeredUsers.find((u) => u.email === email);
    if (!user) return { ok: false, error: 'Invalid email or password' };

    const hash = await hashPassword(password);
    if (hash !== user.passwordHash)
      return { ok: false, error: 'Invalid email or password' };

    set({ currentUser: user });
    return { ok: true };
  },

  signOut: () => {
    set({ currentUser: null });
  },
  deleteAccount: () => {
    const current = get().currentUser;
    if (!current) return;
    set((s) => ({
      currentUser: null,
      registeredUsers: s.registeredUsers.filter((u) => u.id !== current.id),
    }));
  },
  updateUserRole: (userId, newRole) => {
    const editor = get().currentUser;
    if (!editor) return;
    const target = get().registeredUsers.find((u) => u.id === userId);
    if (!target) return;
    if (!canEditRole(editor.role, target.role)) return;
    if (!canAssignRole(editor.role, newRole)) return;

    set((s) => ({
      registeredUsers: s.registeredUsers.map((u) =>
        u.id === userId ? { ...u, role: newRole } : u,
      ),
    }));
  },
});
