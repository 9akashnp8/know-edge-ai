import { useState } from "react"

export default function Flashcards() {
    const [topic, setTopic] = useState("");
    const [flashcards, setFlashcards] = useState([]);

    async function handleSubmit(event) {
        event.preventDefault();
        const resp = await fetch('http://127.0.0.1:8000/api/flashcard/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({query: topic})
        })
        
        if (resp.status == 200) {
            const fcs = await resp.json()
            setFlashcards(fcs)
            console.log(flashcards)
        }
    }

    return (
        <>
            <form method="POST" onSubmit={handleSubmit}>
                <input type="text" onChange={(e) => setTopic(e.target.value)} />
                <button type="submit">Generate Flashcards</button>
            </form>
            <ul>
                {flashcards ? flashcards.response.map((card) => {
                    return <li>{card.q} Answer: {card.a}</li>
                }) : ''}
            </ul>
        </>
    )
}