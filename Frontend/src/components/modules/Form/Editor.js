import "./Editor.css"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
export default function Editor({ setContent, value }) {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}

            onChange={(event, editor) => {
                const data = editor.getData()
                setContent(data)
            }}

        />
    )
}
