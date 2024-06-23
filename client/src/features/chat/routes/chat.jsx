// Hooks and other functions
import { useParams } from "react-router-dom";
import { useGetDocumentQuery } from "../../api/apiSlice";

// UI Components
import ChatBox from "../components/ChatBox";
import DocumentViewer from "../../document/components/DocumentViewer";

export default function Chat() {
    const { fileName } = useParams();
    const { data: documentBlob } = useGetDocumentQuery(fileName)

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 84px)' }}>
            <DocumentViewer documentBlob={documentBlob} />
            <ChatBox />
        </div>
    )
}
