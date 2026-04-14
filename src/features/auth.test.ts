import { describe, expect, it } from 'vitest';
import { createStore } from 'zustand';
import { type AuthSlice, type UserRole, canEditRole, createAuthSlice } from './auth';

function createAuthStore() {
  return createStore<AuthSlice>()(createAuthSlice);
}

describe('auth slice', () => {
  describe('signUp', () => {
    it('creates a user and sets as current user', async () => {
      const store = createAuthStore();
      const result = await store.getState().signUp(
        'alice@example.com',
        'password123',
        'Alice',
        'Smith',
      );

      expect(result.ok).toBe(true);

      const state = store.getState();
      expect(state.currentUser).not.toBeNull();
      expect(state.currentUser!.email).toBe('alice@example.com');
      expect(state.currentUser!.firstName).toBe('Alice');
      expect(state.currentUser!.lastName).toBe('Smith');
      expect(state.currentUser!.id).toBeTruthy();
      expect(state.currentUser!.createdAt).toBeTruthy();
      // Password should be hashed, not plaintext
      expect(state.currentUser!.passwordHash).not.toBe('password123');
      expect(state.currentUser!.passwordHash).toHaveLength(64); // SHA-256 hex

      expect(state.registeredUsers).toHaveLength(1);
      expect(state.registeredUsers[0]).toBe(state.currentUser);
    });

    it('promotes the first user to project_admin (cold start)', async () => {
      const store = createAuthStore();
      await store.getState().signUp('first@example.com', 'pass', 'First', 'User');
      expect(store.getState().currentUser!.role).toBe('project_admin');
    });

    it('assigns subsequent users the user role', async () => {
      const store = createAuthStore();
      await store.getState().signUp('first@example.com', 'pass', 'First', 'User');
      await store.getState().signUp('second@example.com', 'pass', 'Second', 'User');

      const users = store.getState().registeredUsers;
      expect(users).toHaveLength(2);
      expect(users[0].role).toBe('project_admin');
      expect(users[1].role).toBe('user');
    });

    it('rejects duplicate email', async () => {
      const store = createAuthStore();
      await store.getState().signUp('alice@example.com', 'pass', 'Alice', 'A');
      const result = await store.getState().signUp('alice@example.com', 'pass2', 'Bob', 'B');

      expect(result.ok).toBe(false);
      expect(result.error).toBeTruthy();
      expect(store.getState().registeredUsers).toHaveLength(1);
    });
  });

  describe('signIn', () => {
    it('succeeds with correct credentials', async () => {
      const store = createAuthStore();
      await store.getState().signUp('alice@example.com', 'secret', 'Alice', 'A');
      store.getState().signOut(); // clear session to test sign-in

      const result = await store.getState().signIn('alice@example.com', 'secret');
      expect(result.ok).toBe(true);
      expect(store.getState().currentUser!.email).toBe('alice@example.com');
    });

    it('fails with wrong password', async () => {
      const store = createAuthStore();
      await store.getState().signUp('alice@example.com', 'secret', 'Alice', 'A');
      store.getState().signOut();

      const result = await store.getState().signIn('alice@example.com', 'wrong');
      expect(result.ok).toBe(false);
      expect(result.error).toBeTruthy();
      expect(store.getState().currentUser).toBeNull();
    });

    it('fails with unknown email', async () => {
      const store = createAuthStore();
      const result = await store.getState().signIn('nobody@example.com', 'pass');
      expect(result.ok).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('signOut', () => {
    it('clears current user but preserves registered users', async () => {
      const store = createAuthStore();
      await store.getState().signUp('alice@example.com', 'pass', 'Alice', 'A');
      expect(store.getState().currentUser).not.toBeNull();

      store.getState().signOut();
      expect(store.getState().currentUser).toBeNull();
      expect(store.getState().registeredUsers).toHaveLength(1);
    });
  });

  describe('deleteAccount', () => {
    it('removes the current user from registered users and clears session', async () => {
      const store = createAuthStore();
      await store.getState().signUp('alice@example.com', 'pass', 'Alice', 'A');
      await store.getState().signUp('bob@example.com', 'pass', 'Bob', 'B');
      // Sign in as bob
      await store.getState().signIn('bob@example.com', 'pass');

      store.getState().deleteAccount();
      expect(store.getState().currentUser).toBeNull();
      expect(store.getState().registeredUsers).toHaveLength(1);
      expect(store.getState().registeredUsers[0].email).toBe('alice@example.com');
    });
  });

  describe('canEditRole', () => {
    it('allows owner to edit any role', () => {
      const targets: UserRole[] = ['user', 'guest', 'workflow_admin', 'project_admin', 'customer_admin', 'owner'];
      for (const target of targets) {
        expect(canEditRole('owner', target)).toBe(true);
      }
    });

    it('allows customer_admin to edit all except owner', () => {
      expect(canEditRole('customer_admin', 'user')).toBe(true);
      expect(canEditRole('customer_admin', 'project_admin')).toBe(true);
      expect(canEditRole('customer_admin', 'owner')).toBe(false);
    });

    it('allows project_admin to edit user, guest, workflow_admin only', () => {
      expect(canEditRole('project_admin', 'user')).toBe(true);
      expect(canEditRole('project_admin', 'guest')).toBe(true);
      expect(canEditRole('project_admin', 'workflow_admin')).toBe(true);
      expect(canEditRole('project_admin', 'project_admin')).toBe(false);
      expect(canEditRole('project_admin', 'customer_admin')).toBe(false);
      expect(canEditRole('project_admin', 'owner')).toBe(false);
    });

    it('denies non-admin roles from editing anyone', () => {
      const nonAdmins: UserRole[] = ['user', 'guest', 'workflow_admin'];
      for (const editor of nonAdmins) {
        expect(canEditRole(editor, 'user')).toBe(false);
      }
    });
  });

  describe('updateUserRole', () => {
    it('allows an admin to change another user role', async () => {
      const store = createAuthStore();
      // First user = project_admin
      await store.getState().signUp('admin@example.com', 'pass', 'Admin', 'A');
      await store.getState().signUp('user@example.com', 'pass', 'User', 'U');
      // Sign in as admin
      await store.getState().signIn('admin@example.com', 'pass');

      const userId = store.getState().registeredUsers[1].id;
      store.getState().updateUserRole(userId, 'workflow_admin');

      expect(store.getState().registeredUsers[1].role).toBe('workflow_admin');
    });

    it('rejects role change when editor lacks permission', async () => {
      const store = createAuthStore();
      await store.getState().signUp('admin@example.com', 'pass', 'Admin', 'A');
      await store.getState().signUp('user@example.com', 'pass', 'User', 'U');
      // Sign in as the regular user
      await store.getState().signIn('user@example.com', 'pass');

      const adminId = store.getState().registeredUsers[0].id;
      store.getState().updateUserRole(adminId, 'user');

      // Should not have changed — user can't edit project_admin
      expect(store.getState().registeredUsers[0].role).toBe('project_admin');
    });
  });
});
