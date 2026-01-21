import { Button } from "./ui/button"
import { ExternalLink } from "lucide-react"

const FIGMA_ARCH_URL =
  "https://www.figma.com/board/9TD9xOuxBcEtFA4ypvt1im/Smart-Fan-2030---Architecture?node-id=0-1"

const SUPABASE_DASHBOARD_URL =
  "https://supabase.com/dashboard/project/nkpxgqvstvxfovjbcygb"

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer")

export function ArchitecturePage() {
  // Embed Figma
  const embedUrl =
    "https://www.figma.com/embed?embed_host=share&url=" + encodeURIComponent(FIGMA_ARCH_URL)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Architecture</h1>
          <p className="text-gray-600">
            Vue intégrée du board Figma (gratuit). Si l’embed ne s’affiche pas, ouvre le lien dans un nouvel onglet.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openExternal(FIGMA_ARCH_URL)}>
            <ExternalLink className="size-4 mr-2" />
            Ouvrir Figma
          </Button>

          <Button variant="outline" onClick={() => openExternal(SUPABASE_DASHBOARD_URL)}>
            <ExternalLink className="size-4 mr-2" />
            Ouvrir Supabase
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-xl border bg-white overflow-hidden">
        <iframe
          title="Smart Fan 2030 - Architecture Figma"
          src={embedUrl}
          style={{ width: "100%", height: "78vh" }}
          allowFullScreen
        />
      </div>
    </div>
  )
}
