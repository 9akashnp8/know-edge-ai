import { Typography } from "@mui/material"

import { useState } from "react"

export default function Home() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    async function handleFileUpload(event) {
        event.preventDefault()
        const formData = new FormData();
        formData.append("payload", file, file.name)
        const resp = await fetch('http://127.0.0.1:8000/api/uploadfile/', {
            method: 'POST',
            body: formData
        })
        setUploadStatus(resp.status == 200 ? "Uploaded Successfully" : "Error When Uploading")
    }
    return (
        <>
            <Typography variant="h4" component={"h1"}>Upload your document</Typography>
            <form method="POST" onSubmit={handleFileUpload}>
                <input type="file" name="document" id="document" onChange={(e) => setFile(e.target.files[0])}/>
                <button type="submit">Upload</button>
            </form>
            {uploadStatus}
        </>
    )
}