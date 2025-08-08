import { useState } from 'react'
import './App.css'

import JournalList from './JournalList';

function App() {

    return (
        <>
            <div>
                <h1>D&D Journal & Loot Tracker</h1>
                <JournalList />
            </div>
        </>
    )
}

export default App
