'use client'

import FormButton from "@/components/FormButton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";
import getUserOrdersServerAction from "./_actions/getUserOrdersServerAction";
import { AlertCard } from "@/components/AlertCard";
import { useRef } from "react";

export default function OrdersPage() {
  const [state, action] = useFormState(getUserOrdersServerAction, null)
  const formRef = useRef<HTMLFormElement>(null)
  if (state?.message) {
    formRef.current?.reset()
  }

  return (
    <form action={action} className="mt-5 w-full max-w-xl" ref={formRef}>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            Request your orders via Email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input type="email" id="email" name="email" placeholder="Enter Your Email Address" required disabled={!!state?.message} />
        </CardContent>
        <CardFooter>
          {
            state?.message ? state.message : <FormButton BtnName="Send" className="w-full" />
          }
        </CardFooter>
      </Card>
      {
        state?.error && <AlertCard variant="destructive" title="Error" message={state?.error} className="mt-4" />
      }
    </form>
  )
}