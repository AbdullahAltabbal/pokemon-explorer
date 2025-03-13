import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PokemonCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-4 pb-2">
        <div className="w-full aspect-square mb-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="text-center">
          <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
        </div>
      </CardContent>
      <CardFooter className="p-2 pt-0 flex justify-center">
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  )
}

