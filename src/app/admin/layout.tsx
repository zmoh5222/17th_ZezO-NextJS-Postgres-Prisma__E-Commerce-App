import { Nav, NavLink } from "@/components/Nav";
import { Metadata } from "next";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "ZezO Admin Dashboard",
  description: "E-Commerce Admin Dashboard Page",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href='/admin'>Dashboard</NavLink>
        <NavLink href='/admin/products'>Products</NavLink>
        <NavLink href='/admin/customers'>Customers</NavLink>
        <NavLink href='/admin/sales'>Sales</NavLink>
        <NavLink href='/admin/discount-coupons'>Coupons</NavLink>
      </Nav>
      <div className="container my-6">{ children }</div>
    </>
  )
}