import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AdminDashboardCardProps = {
  title: string
  description: string
  content: string
}

export default function AdminDashboardCard({title, description, content}: AdminDashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  )
}