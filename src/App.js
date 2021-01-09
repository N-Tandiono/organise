/*global chrome*/
import { React, useState } from "react";
import './App.css';

export const HOME = 0;
export const TIMETABLE = 1;
export const RANDOM = 2;

function App() {
    const [page, setPage] = useState(TIMETABLE);
    var content = "Error, content could not be found. Please try again later.";
    if (page === HOME) {
        content = (
            <>
                <h1>HOME</h1>
            </>
        );
    } else if (page === TIMETABLE) {
        content = (
            <>
                <h1>TIMETABLE</h1>
            </>
        );
    } else if (page === RANDOM) {
        content = (
            <>
                <h1>RANDOM</h1>
            </>
        );
    }
    return (
        <div className='App'>
            <h1>organise</h1>
            {content}
        </div>
    );
};

export default App;
