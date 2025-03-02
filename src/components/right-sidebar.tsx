import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RightSidebar() {
  const pinnedPosts = [
    { id: 1, title: "Anuncio importante", content: "Reunión general mañana a las 10:00 AM" },
    { id: 2, title: "Recordatorio", content: "Entrega de reportes para el viernes" },
  ]

  return (
    <div className="space-y-6 flex flex-col items-start">
      <Card className="w-74">
        <CardContent>
          <CardHeader className="text-center">
            <CardTitle>Calendario</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar />
          </CardContent>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Publicaciones Fijadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pinnedPosts.map((post) => (
              <div key={post.id} className="border-b pb-2 last:border-b-0">
                <h4 className="font-semibold">{post.title}</h4>
                <p className="text-sm text-gray-600">{post.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}