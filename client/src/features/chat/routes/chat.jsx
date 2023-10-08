// Hooks and other functions
import { useSearchParams } from "react-router-dom";
import { useGetDocumentQuery } from "../../api/apiSlice";

// UI Components
import ChatBox from "../components/ChatBox";
import DocumentViewer from "../../document/components/DocumentViewer";

export default function Chat() {
    const [searchParams] = useSearchParams();
    const { data: documentBlob } = useGetDocumentQuery(searchParams.get('fileName'))

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 84px)' }}>
            <DocumentViewer documentBlob={documentBlob} />
            <ChatBox />
        </div>
    )
}
