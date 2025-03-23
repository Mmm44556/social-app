import { SignInButton, UserButton } from "@clerk/nextjs";

import { SignUpButton } from "@clerk/nextjs";

import { SignedOut, SignedIn } from "@clerk/nextjs";

export default function Auth() {
  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <SignInButton mode="modal" />
        <SignUpButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
