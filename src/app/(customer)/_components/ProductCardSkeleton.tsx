import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden animate-pulse">
      <div className="relative w-full h-auto bg-gray-300 aspect-video"></div>
      <CardHeader>
        <CardTitle>
          <div className="bg-gray-300 h-5 rounded-full"></div>
        </CardTitle>
        <div className="bg-gray-300 h-3 w-1/3 rounded-full"></div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="bg-gray-300 h-5 rounded-full mt-4"></div>
        <div className="bg-gray-300 h-5 w-4/5 rounded-full mt-2"></div>
      </CardContent>
      <CardFooter>
      <span className="w-full h-[50px] bg-gray-300 rounded"></span>
      </CardFooter>
    </Card>
  )
}