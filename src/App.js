/*global chrome*/
import { React, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import './App.css';
import Popup from 'reactjs-popup';

export const HOME = 0;
export const TIMETABLE = 1;
export const BLOCK = 2;
export const SETTINGS = 3;

function App() {
    const { register, handleSubmit } = useForm();
    const [page, setPage] = useState(TIMETABLE);
    const [info, setInfo] = useState([]);
    const current_timetable = [];

    function closeSlot(task, time) {
        // TODO
    }

    function TimetableSlot(props) {

        return (
            <>
                <h1>{props.task} | {props.time} | Time <button onClick={() => closeSlot(props.task, props.time)}>Close</button ></h1>
            </>
        )
    }

    const addDataTimetable = data => {
        info.push({ task: data.task, time: data.time });
        chrome.storage.sync.set(
            {
                info: info
            })
        chrome.storage.sync.get(
            {
                info: 0,
            },
            ({ info }) => {
                console.log(info)
            }
        )
    }

    function changeContent(setPage, page) {
        console.log(page)
        chrome.storage.sync.set(
            {
                page: page
            })
        chrome.storage.sync.get(
            {
                page: 0,
            },
            ({ page }) => {
                console.log(page)
            }
        )
        setPage(page);
    }

    window.onload = function () {
        console.log("LOAD")
        chrome.storage.sync.get(
            {
                page: "error",
                info: []
            },
            ({ page, info }) => {
                setPage(parseInt(page))
                setInfo(info)
            }
        );
    }

    var content = "Error, content could not be found. Please try again later.";
    if (page === HOME) {
        content = (
            <>
                <h1>HOME</h1>
            </>
        );
    } else if (page === TIMETABLE) {
        for (const [_, data] of info.entries()) {
            current_timetable.push(
                <TimetableSlot task={data.task} time={data.time} />
            )
        }
        content = (
            <>
                <h1>TIMETABLE</h1>
                <Popup trigger={<button className="button"> + </button>} modal nested>
                    {close => (
                        <div className="timetable-form">
                            <button className="timetable-form-close" onClick={close}>&times;</button>
                            <div className="timetable-form-title"> Add Event </div>
                            <div className="timetable-form-content">
                                <form onSubmit={handleSubmit(addDataTimetable)}>
                                    <label>Task</label>
                                    <input ref={register} name="task" />
                                    <br />
                                    <label>Time</label>
                                    <input ref={register} name="time" />
                                    <button>Submit</button>
                                </form>
                            </div>
                        </div>
                    )}
                </Popup>
                { current_timetable}
            </>
        );
    } else if (page === BLOCK) {
        content = (
            <>
                <h1>BLOCK</h1>
            </>
        );
    } else if (page === SETTINGS) {
        content = (
            <>
                <h1>SETTINGS</h1>
            </>
        );
    }
    return (
        <div className='App'>
            <div className="navigation">
                <button onClick={() => changeContent(setPage, HOME)}>Home</button>
                <button onClick={() => changeContent(setPage, TIMETABLE)}>Timetable</button>
                <button onClick={() => changeContent(setPage, BLOCK)}>Block</button>
                <button onClick={() => changeContent(setPage, SETTINGS)}>Settings</button>
            </div>
            <div className="main-container">
                <div className="title">
                    <h1>organise</h1>
                </div>
                {content}
            </div>
        </div>
    );
};

export default App;
