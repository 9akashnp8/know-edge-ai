import { useState } from "react"
export default function QnA() {
    const [ question, setQuestion ] = useState("")
    const [ answer, setAnswer ] = useState("")

    async function handleSubmit(event) {
        event.preventDefault()
        setAnswer('Loading')
        const resp = await fetch('http://127.0.0.1:8000/api/query/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({query: question})
        })
        if (resp.status == 200) {
            const queryAnswer = await resp.json()
            setAnswer(queryAnswer.response)
            setQuestion("")
        }
    }
    return (
        <>
            <form method="POST" onSubmit={handleSubmit}>
                <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
                <button type="submit">Ask Question</button>
            </form>
            <p>{answer}</p>
        </>
    )
}