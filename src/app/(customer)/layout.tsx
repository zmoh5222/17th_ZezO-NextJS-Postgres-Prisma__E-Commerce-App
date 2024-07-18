import { Nav, NavLink } from "@/components/Nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZezO Customer Dashboard",
  description: "E-Commerce customer dashboard",
};

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href='/'>Home</NavLink>
        <NavLink href='/products'>Products</NavLink>
        <NavLink href='/orders'>Orders</NavLink>
        <NavLink href='/admin'>Admin Dashboard</NavLink>
      </Nav>
      <div className="container my-6">{ children }</div>
    </>
  )
}