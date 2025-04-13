"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Lock, Mail, ArrowRight, Terminal } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="container relative z-10 mx-auto flex max-w-screen-xl flex-1 items-center justify-center px-4 py-8">
      <div className="grid w-full gap-8 md:grid-cols-[1fr_500px] lg:gap-16">
        {/* Left side - Branding */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Nexus</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                future
              </span>{" "}
              of technology
            </h2>
            <p className="text-lg text-gray-400">
              Secure access to your dashboard. Monitor, analyze, and control
              your tech ecosystem from anywhere.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-gray-800 bg-gray-900/50 px-4 py-1 text-sm backdrop-blur">
              Advanced Security
            </div>
            <div className="rounded-full border border-gray-800 bg-gray-900/50 px-4 py-1 text-sm backdrop-blur">
              Real-time Analytics
            </div>
            <div className="rounded-full border border-gray-800 bg-gray-900/50 px-4 py-1 text-sm backdrop-blur">
              Cloud Integration
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full h-full">
          <div className="p-8 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/70 backdrop-blur-sm">
            <SignUp.Root>
              <Clerk.Loading>
                {(isGlobalLoading) => (
                  <div className="relative ">
                    <SignUp.Step name="start" className="space-y-6">
                      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl"></div>
                      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl"></div>

                      <div className="relative">
                        <div className="">
                          <h3 className="text-2xl font-bold">Sign Up</h3>
                          <p className="text-gray-400">
                            Create an account to get started
                          </p>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="space-y-4">
                          <Clerk.Field
                            name="emailAddress"
                            className="space-y-2"
                          >
                            <Clerk.Label asChild>
                              <Label htmlFor="email">Email</Label>
                            </Clerk.Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Clerk.Input
                                type="email"
                                placeholder="name@example.com"
                                required
                                asChild
                              >
                                <Input
                                  id="email"
                                  placeholder="name@example.com"
                                  // value={email}
                                  // onChange={(e) => setEmail(e.target.value)}
                                  className="border-gray-800 bg-gray-950/50 pl-10 text-white placeholder:text-gray-500 focus-visible:ring-blue-600"
                                  required
                                />
                              </Clerk.Input>
                            </div>
                            <Clerk.FieldError className="block text-sm text-destructive" />
                          </Clerk.Field>

                          <Clerk.Field name="password" className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Clerk.Label asChild>
                                <Label htmlFor="password">Password</Label>
                              </Clerk.Label>
                              <div className="flex items-center justify-between">
                                <a
                                  href="#"
                                  className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                  Forgot password?
                                </a>
                              </div>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Clerk.Input type="password" required asChild>
                                <Input
                                  id="password"
                                  placeholder="••••••••"
                                  className="border-gray-800 bg-gray-950/50 pl-10 pr-10 text-white placeholder:text-gray-500 focus-visible:ring-blue-600"
                                  required
                                />
                              </Clerk.Input>
                            </div>
                            {/* <button
                                  type="button"
                                  // onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                                >
                                  {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                                </button> */}
                            <Clerk.FieldError className="block text-sm text-destructive" />
                          </Clerk.Field>
                        </div>
                        <div className="grid w-full gap-y-4 mt-6">
                          <SignUp.Captcha className="empty:hidden" />
                          <SignUp.Action submit asChild>
                            <Button
                              disabled={isGlobalLoading}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              <Clerk.Loading>
                                {(isLoading) => {
                                  return isLoading ? (
                                    <Icons.spinner className="size-4 animate-spin" />
                                  ) : (
                                    <div className="flex items-center justify-center">
                                      <span>Sign up</span>
                                      <ArrowRight className="ml-2 h-4 w-4" />
                                    </div>
                                  );
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignUp.Action>
                          <Button
                            variant="link"
                            size="sm"
                            asChild
                            className="text-center text-sm text-gray-400"
                          >
                            <Clerk.Link
                              navigate="sign-in"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Already have an account? Sign in
                            </Clerk.Link>
                          </Button>
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="bg-gray-900 px-2 text-gray-500">
                                Or continue with
                              </span>
                            </div>
                          </div>

                          {/* OAuth */}
                          <div className="grid grid-cols-2 gap-3">
                            <Clerk.Connection
                              name="google"
                              asChild
                              className="border-gray-800 bg-gray-950/50 text-white hover:bg-gray-800"
                            >
                              <Button variant="outline">
                                <Icons.google className="mr-2 h-4 w-4" />
                                Google
                              </Button>
                            </Clerk.Connection>
                            <Clerk.Connection
                              name="discord"
                              asChild
                              className="border-gray-800 bg-gray-950/50 text-white hover:bg-gray-800"
                            >
                              <Button variant="outline">
                                <Icons.discord className="mr-2 h-4 w-4" />
                                Discord
                              </Button>
                            </Clerk.Connection>
                          </div>
                        </div>
                      </div>
                    </SignUp.Step>

                    <SignUp.Step name="continue">
                      <Card className="w-full sm:w-96">
                        <CardHeader>
                          <CardTitle>Continue registration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Clerk.Field name="username" className="space-y-2">
                            <Clerk.Label>
                              <Label>Username</Label>
                            </Clerk.Label>
                            <Clerk.Input type="text" required asChild>
                              <Input />
                            </Clerk.Input>
                            <Clerk.FieldError className="block text-sm text-destructive" />
                          </Clerk.Field>
                        </CardContent>
                        <CardFooter>
                          <div className="grid w-full gap-y-4">
                            <SignUp.Action submit asChild>
                              <Button disabled={isGlobalLoading}>
                                <Clerk.Loading>
                                  {(isLoading) => {
                                    return isLoading ? (
                                      <Icons.spinner className="size-4 animate-spin" />
                                    ) : (
                                      "Continue"
                                    );
                                  }}
                                </Clerk.Loading>
                              </Button>
                            </SignUp.Action>
                          </div>
                        </CardFooter>
                      </Card>
                    </SignUp.Step>

                    <SignUp.Step name="verifications">
                      <SignUp.Strategy name="email_code">
                        <Card className="w-full sm:w-96">
                          <CardHeader>
                            <CardTitle>Verify your email</CardTitle>
                            <CardDescription>
                              Use the verification link sent to your email
                              address
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="grid gap-y-4">
                            <div className="grid items-center justify-center gap-y-2">
                              <Clerk.Field name="code" className="space-y-2">
                                <Clerk.Label className="sr-only">
                                  Email address
                                </Clerk.Label>
                                <div className="flex justify-center text-center">
                                  <Clerk.Input
                                    type="otp"
                                    className="flex justify-center has-[:disabled]:opacity-50"
                                    autoSubmit
                                    render={({ value, status }) => {
                                      return (
                                        <div
                                          data-status={status}
                                          className={cn(
                                            "relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                                            {
                                              "z-10 ring-2 ring-ring ring-offset-background":
                                                status === "cursor" ||
                                                status === "selected",
                                            }
                                          )}
                                        >
                                          {value}
                                          {status === "cursor" && (
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                              <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }}
                                  />
                                </div>
                                <Clerk.FieldError className="block text-center text-sm text-destructive" />
                              </Clerk.Field>
                              <SignUp.Action
                                asChild
                                resend
                                className="text-muted-foreground"
                                fallback={({ resendableAfter }) => (
                                  <Button variant="link" size="sm" disabled>
                                    Didn&apos;t receive a code? Resend (
                                    <span className="tabular-nums">
                                      {resendableAfter}
                                    </span>
                                    )
                                  </Button>
                                )}
                              >
                                <Button type="button" variant="link" size="sm">
                                  Didn&apos;t receive a code? Resend
                                </Button>
                              </SignUp.Action>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <div className="grid w-full gap-y-4">
                              <SignUp.Action submit asChild>
                                <Button disabled={isGlobalLoading}>
                                  <Clerk.Loading>
                                    {(isLoading) => {
                                      return isLoading ? (
                                        <Icons.spinner className="size-4 animate-spin" />
                                      ) : (
                                        "Continue"
                                      );
                                    }}
                                  </Clerk.Loading>
                                </Button>
                              </SignUp.Action>
                            </div>
                          </CardFooter>
                        </Card>
                      </SignUp.Strategy>
                    </SignUp.Step>
                  </div>
                )}
              </Clerk.Loading>
            </SignUp.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
