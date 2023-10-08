// Internal UI Components
import ChatMessage from "./ChatMessage"

export default function ChatMessagesWindow({ messageHistory, chatResponse }) {
    return (
        <div id="scroller" style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
            {messageHistory.map((message, idx) => (
                <ChatMessage key={idx} messager={message.user} >
                    {message ? message.message : null}
                </ChatMessage>
            ))}
            {chatResponse
                ? <ChatMessage messager={'system'}>{chatResponse}</ChatMessage>
                : null
            }

            <div id="anchor"></div>
        </div>
    )
}
