import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sorry, something went wrong.</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {params?.reason === 'invalid_confirmation_link'
                  ? 'This confirmation link is missing information or has expired.'
                  : 'We could not complete that authentication request. Please try again.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
