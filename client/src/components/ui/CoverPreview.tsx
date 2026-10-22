import { useEffect, useMemo } from "react"
import { FaImage } from "react-icons/fa6"
import { coverUrl } from "../../config/env"

interface CoverPreviewProps {
    file: unknown
    current?: string
}

export default function CoverPreview({ file, current }: CoverPreviewProps) {
    const chosen = typeof FileList !== "undefined" && file instanceof FileList ? file[0] : undefined
    const preview = useMemo(() => (chosen ? URL.createObjectURL(chosen) : undefined), [chosen])
    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

    const src = preview ?? coverUrl(current)
    return (
        <div className="ratio ratio-16x9 rounded-3 overflow-hidden border bg-body-tertiary">
            {src ?
                <img src={src} alt="Cover preview" className="object-fit-cover" /> :
                <div className="d-flex flex-column align-items-center justify-content-center text-body-secondary small gap-2">
                    <FaImage className="fs-3" /> 16:9 image, e.g. 1280×720
                </div>}
        </div>
    )
}
