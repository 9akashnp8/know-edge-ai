
export default function DocumentViewer({ documentBlob }) {

    return (
        <embed
            src={documentBlob ? URL.createObjectURL(documentBlob) : ''}
            type="application/pdf"
            frameBorder="0"
            scrolling="auto"
            style={{
                width: '95%',
                borderRadius: '1rem 0 0 1rem'
            }}
        ></embed>
    )
}
