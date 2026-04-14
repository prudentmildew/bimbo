# User & Access Management — Feature Design

**Module**: #6 — User & Access Management
**Status**: Ideation complete
**Date**: 2026-04-14

---

## Summary

Add authentication and user management to the Bimbo PoC. Users must sign in before accessing the app. Credentials are mocked (no external backend) with state managed in Zustand and persisted to localStorage. The `/users` admin page becomes a functional user list with role editing.

---

## Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Auth backend | **Fully mocked** — no external services, all client-side |
| 2 | Session persistence | **Zustand slice + `persist` middleware** to localStorage |
| 3 | User model | **Domain-aligned** — `id`, `email`, `password` (hashed), `firstName`, `lastName`, `role`, `createdAt` |
| 4 | Password handling | **SHA-256 via `crypto.subtle`** — not real security, but avoids plaintext in localStorage |
| 5 | Landing screen | **Full-page takeover** — dedicated auth page replaces app shell when unauthenticated |
| 6 | Route protection | **`beforeLoad` guard on root route** — redirect to `/login` if not authenticated |
| 7 | Account deletion | **Simple confirm dialog**, hard delete from localStorage, action lives in a **profile dropdown** |
| 8 | Sign-up fields | **Email + password + first name + last name** |
| 9 | Default role | **`User`** — admins promote later |
| 10 | `/users` admin page | **User list + role editing** — visible to all, editable by admin roles only |
| 11 | Admin page access | **Visible to all users**, edit controls restricted to Project Admin / Customer Admin / Owner |
| 12 | User profile menu | **Avatar dropdown in left sidebar** — shows name, email, role, sign out, delete account |
| 13 | Landing page design | **Minimal centered card** — dark zinc background, app name, sign-in/sign-up tabs |
| 14 | Cold start | **First registered user auto-promoted to Project Admin** |

---

## User Model

```typescript
type UserRole =
  | 'user'
  | 'guest'
  | 'workflow_admin'
  | 'project_admin'
  | 'customer_admin'
  | 'owner';

interface MockUser {
  id: string;             // crypto.randomUUID()
  email: string;
  passwordHash: string;   // SHA-256 hex digest
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;      // ISO 8601
}
```

---

## Auth Zustand Slice

```typescript
interface AuthSlice {
  // State
  currentUser: MockUser | null;
  registeredUsers: MockUser[];

  // Actions
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ ok: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  deleteAccount: () => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
}
```

Persisted to localStorage via Zustand's `persist` middleware. The slice is composed into the existing `useAppStore`.

---

## Routes & Components

### New route: `/login`
- **Full-page layout** — does NOT render inside AppShell
- Centered card on dark zinc background
- App name ("bimbo") + subtitle above the card
- Two tabs: **Sign In** / **Sign Up**
- Sign In: email + password fields + submit
- Sign Up: first name, last name, email, password fields + submit
- Validation: required fields, email format, password min length, duplicate email check

### Modified: `__root.tsx`
- `beforeLoad` checks `useAppStore.getState().currentUser`
- If `null` and not on `/login`, redirect to `/login`
- If authenticated and on `/login`, redirect to `/viewer`

### Modified: Left sidebar (`LeftSidebar.tsx`)
- Add user avatar/badge at the bottom of the sidebar
- Shows first name + role badge
- Click opens dropdown: profile info (name, email, role), Sign Out button, Delete Account button
- Delete Account triggers a confirm dialog, then calls `deleteAccount()` and redirects to `/login`

### Modified: `/users` route
- Replace ShellPlaceholder with a functional user table
- Columns: Name, Email, Role, Joined
- For admin roles (Project Admin, Customer Admin, Owner): role column shows a dropdown to change another user's role
- For non-admin roles: role column is read-only text
- Current user's own row is visually distinguished

---

## Role Hierarchy (for edit permissions)

Roles that can edit other users' roles:
- **Owner** — can edit anyone
- **Customer Admin** — can edit anyone except Owner
- **Project Admin** — can edit User, Guest, Workflow Admin

Non-admin roles (`User`, `Guest`, `Workflow Admin`) cannot edit roles.

---

## Cold Start Logic

In the `signUp` action:
```
if (registeredUsers.length === 0) {
  newUser.role = 'project_admin';  // First user becomes admin
}
```

---

## File Changes Summary

| File | Change |
|------|--------|
| `src/features/auth.ts` | **New** — AuthSlice definition, signUp/signIn/signOut/deleteAccount/updateUserRole logic, SHA-256 helper |
| `src/store/index.ts` | Compose AuthSlice into AppState, add `persist` middleware |
| `src/routes/login.tsx` | **New** — full-page login/signup route |
| `src/routes/__root.tsx` | Add `beforeLoad` auth guard |
| `src/routes/users.tsx` | Replace shell with user admin table |
| `src/components/layout/LeftSidebar.tsx` | Add user avatar dropdown at bottom |
| `src/components/user/UserMenu.tsx` | **New** — avatar dropdown component (profile info, sign out, delete account) |
| `src/components/user/UserTable.tsx` | **New** — admin user list with role editing |
| `src/components/user/RoleSelect.tsx` | **New** — role dropdown (used in sign-up default display and admin table) |
| `src/features/shells.ts` | Remove `UsersSlice` stub (replaced by real AuthSlice) |

---

## Out of Scope (future work)

- Groups and nested group permissions
- Guest expiration dates
- MFA configuration
- Invitation workflows (email, CSV/XLSX batch)
- Enterprise-level cross-project admin
- User data export (Power BI, Excel)
- Password reset/change flow
- Profile editing (name, email changes)
