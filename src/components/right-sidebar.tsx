// RightSidebar.jsx or RightSidebar.tsx
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RightSidebar() {
  const pinnedPosts = [
    { id: 1, title: "Anuncio importante", content: "Reunión general mañana a las 10:00 AM Reunión general mañana a las 10:00 AM Reunión general mañana a las 10:00 AM Reunión general mañana a las 10:00 AM Reunión general mañana a las 10:00 AM sdasadsa dsadsa " },
    { id: 2, title: "Recordatorio", content: "Entrega de reportes para el viernes" },
  ]

  return (
    <div className="space-y-6 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Calendario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Calendar className="max-w-full" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Publicaciones Fijadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pinnedPosts.map((post) => (
              <div key={post.id} className="border-b pb-2 last:border-b-0">
                <h4 className="font-semibold">{post.title}</h4>
                <p className="text-sm text-gray-600 break-words">{post.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}