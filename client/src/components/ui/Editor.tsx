import { CKEditor } from "@ckeditor/ckeditor5-react"
import {
    BlockQuote, Bold, ClassicEditor, CodeBlock, Essentials, Heading, Italic, Link, List, Paragraph,
} from "ckeditor5"
import type { EditorConfig } from "ckeditor5"
import "ckeditor5/ckeditor5.css"

const config: EditorConfig = {
    licenseKey: "GPL",
    plugins: [Essentials, Paragraph, Heading, Bold, Italic, Link, List, BlockQuote, CodeBlock],
    toolbar: ["undo", "redo", "|", "heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "blockQuote", "codeBlock"],
}

interface EditorProps {
    value?: string
    setContent: (html: string) => void
}

export default function Editor({ value, setContent }: EditorProps) {
    return (
        <CKEditor
            editor={ClassicEditor}
            config={config}
            data={value}
            onChange={(_event, editor) => setContent(editor.getData())}
        />
    )
}
