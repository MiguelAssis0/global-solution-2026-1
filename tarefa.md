````md
# Task — Create Araterra Auth Page

Implement the authentication page inside:

```txt
/frontend/araterra/src
````

The frontend uses **TypeScript**, so create `.tsx` and `.ts` files.

Use the backend auth API located at:

```txt
backend/araterra-backend/src/main/java/com/araterra/demo/auth/internal
```

Inspect backend controllers/DTOs first and integrate with existing login/register endpoints.

---

# Suggested Files

```txt
/frontend/araterra/src/pages/AuthPage.tsx
/frontend/araterra/src/pages/AuthPage.css
/frontend/araterra/src/services/authService.ts
/frontend/araterra/src/config/api.ts
```

---

# Layout

Desktop:

```txt
60% left = image/placeholder
40% right = login/register form
```

Mobile:

```txt
hide left image section
form takes 100%
```

---

# Visual Style

* Site name: `Araterra`
* Main color: blue
* Modern SaaS/geospatial style
* Rounded card
* Soft shadow

---

# Auth Behavior

Create an auth card with toggle between:

* Login
* Register

Default mode: Login.

Login fields:

```txt
email
password
```

Register fields:

```txt
name
email
password
confirmPassword
```

---

# API Layer

Do not call fetch/axios directly inside the component.

Create:

```ts
login(data: LoginRequest): Promise<AuthResponse>
register(data: RegisterRequest): Promise<AuthResponse>
logout(): void
saveToken(token: string): void
getToken(): string | null
isAuthenticated(): boolean
```

Use TypeScript interfaces:

```ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: unknown;
}
```

Handle both `token` and `accessToken` just in case.

Store token as:

```txt
araterra_token
```

---

# Behavior

* Login calls backend login endpoint
* Register calls backend register endpoint
* Show loading state
* Show inline errors
* Validate required fields
* Validate password confirmation
* Redirect to dashboard/map after successful login
* After register, auto-login if token exists, otherwise switch to login mode

---

# Acceptance Criteria

* TypeScript auth page implemented
* Desktop uses 60/40 layout
* Mobile hides image section
* Login/register integrated with backend
* Token saved after login
* API calls isolated in `authService.ts`
* Blue Araterra visual identity

```
```
