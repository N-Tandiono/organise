/*global chrome*/
import { React, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import './App.css';
import Popup from 'reactjs-popup';

export const HOME = 0;
export const TODO = 1;
export const TIMETABLE = 2;
export const BLOCK = 3;
export const SETTINGS = 4;

function App() {
    const { register, handleSubmit } = useForm();
    const [page, setPage] = useState(TIMETABLE);
    const [info, setInfo] = useState([]);
    const [todoList, setTodoList] = useState([])
    const [todoListCounter, setTodoListCounter] = useState(0)
    const current_timetable = [];
    const current_todo = [];

    function closeTimetableSlot(task, time) {
        let newArray = info
        newArray = info.filter(ele => ele.task !== task && ele.time !== time)
        chrome.storage.sync.set(
            {
                info: newArray
            })
        chrome.storage.sync.get(
            {
                info: 0,
            },
            ({ info }) => {
                console.log(info)
            }
        )
        setInfo(newArray)
    }

    function closeTodoSlot(u_id) {
        console.log("CURRENT:" + u_id)
        console.log("TEST " + todoList)
        let newArray = todoList
        newArray = todoList.filter(ele => ele.u_id !== u_id)
        chrome.storage.sync.set(
            {
                todo: newArray
            })
        chrome.storage.sync.get(
            {
                todo: 0,
            },
            ({ todo }) => {
                console.log("Updated is: " + todo)
            }
        )
        setTodoList(newArray)
    }

    function TimetableSlot(props) {
        let day = "Monday";
        if (props.priority === 7) {
            day = "Monday"
        } else if (props.priority === 6) {
            day = "Tuesday"
        } else if (props.priority === 5) {
            day = "Wednesday"
        } else if (props.priority === 4) {
            day = "Thursday"
        } else if (props.priority === 3) {
            day = "Friday"
        } else if (props.priority === 2) {
            day = "Saturday"
        } else if (props.priority === 1) {
            day = "Sunday"
        }
        return (
            <>
                <div className="timetableSlot">
                    <table>
                        <tr>
                            <td className="taskTable">{props.task}</td>
                            <td className="dayTable">{day}</td>
                            <td>{props.time}<button className="deleteEntry" onClick={() => closeTimetableSlot(props.task, props.time)}> &#10005; </button ></td>
                        </tr>
                    </table>
                </div>
            </>
        )
    }

    function TodoSlot(props) {
        console.log(props)
        let colour = 'black';
        if (props.priority === "3") {
            colour = 'green'
        }
        else if (props.priority === "2") {
            colour = 'yellow'
        }
        else if (props.priority === "1") {
            colour = 'red'
        }
        return (
            <>
                <table>
                    <tr>
                        <td className="taskTodoTable">{props.task}</td>
                        <td className="priorityTable" style={{ 'background-color': colour }}><button className="deleteEntry" onClick={() => closeTodoSlot(props.u_id)}> &#10005; </button ></td>
                    </tr>
                </table>
            </>
        )
    }

    const addDataTimetable = data => {
        info.push({ task: data.task, priority: data.priority, time: data.time });
        info.sort(compare)
        chrome.storage.sync.set(
            {
                info: info
            })
        chrome.storage.sync.get(
            {
                info: [],
            },
            ({ info }) => {
                console.log(info)
            }
        )
    }

    const addTodo = data => {
        todoList.push({ u_id: todoListCounter, task: data.task, priority: data.priority });
        setTodoListCounter(todoListCounter + 1)
        todoList.sort(compare);

        chrome.storage.sync.set(
            {
                todo: todoList,
                u_id: todoListCounter + 1
            })
        chrome.storage.sync.get(
            {
                todo: [],
                u_id: 0
            },
            ({ todo, u_id }) => {
                console.log(todo)
                console.log(u_id)
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
        chrome.storage.sync.get(
            {
                page: 0,
                info: [],
                todo: [],
                u_id: 0
            },
            ({ page, info, todo, u_id }) => {
                setPage(parseInt(page))
                setInfo(info)
                setTodoList(todo)
                setTodoListCounter(parseInt(u_id))
            }
        );
    }

    var content = "Error, content could not be found. Please try again later.";
    if (page === HOME) {
        content = (
            <div className="title">
                <h1>organise</h1>
            </div>
        );
    } else if (page === TODO) {
        console.log(todoList)
        for (const [_, data] of todoList.entries()) {
            current_todo.push(
                <TodoSlot task={data.task} priority={data.priority} u_id={data.u_id} />
            )
        }
        content = (
            <>
                <div className="title">
                    <h1>organise - To Do</h1>
                </div>
                <Popup trigger={<button className="button"> + </button>} modal nested>
                    {close => (
                        <div className="todo-form">
                            <button className="form-close" onClick={close}>&times;</button>
                            <div className="todo-form-title"><b>Add Task</b></div>
                            <div className="todo-form-content">
                                <form onSubmit={handleSubmit(addTodo)}>
                                    <label>Task&nbsp;</label>
                                    <input ref={register} name="task" />
                                    <br />
                                    <label>Priority&nbsp;</label>
                                    <select name="priority" ref={register}>
                                        <option value="3">Low</option>
                                        <option value="2">Medium</option>
                                        <option value="1">High</option>
                                    </select>
                                    <button>Submit</button>
                                </form>
                            </div>
                        </div>
                    )}
                </Popup>
                <div className="scrolling-container">
                    <table>
                        <th className="taskTodoTable">Task</th>
                        <th>Priority</th>
                    </table>
                    {current_todo}
                </div>
            </>
        );
    } else if (page === TIMETABLE) {
        for (const [_, data] of info.entries()) {
            current_timetable.push(
                <TimetableSlot task={data.task} priority={data.priority} time={data.time} />
            )
        }
        content = (
            <>
                <div className="title">
                    <h1>organise - TimeTable</h1>
                </div>
                <Popup trigger={<button className="button">+</button>} modal nested>
                    {close => (
                        <div className="timetable-form">
                            <button className="form-close" onClick={close}>&times;</button>
                            <div className="timetable-form-title"><b>Add Event</b></div>
                            <div className="timetable-form-content">
                                <form onSubmit={handleSubmit(addDataTimetable)}>
                                    <label>Task&nbsp;&nbsp;</label>
                                    <input ref={register} name="task" />
                                    <br />
                                    <label>Day&nbsp;&nbsp;&nbsp;</label>
                                    <select name="priority" ref={register}>
                                        <option value="1">Monday</option>
                                        <option value="2">Tuesday</option>
                                        <option value="3">Wednesday</option>
                                        <option value="4">Thursday</option>
                                        <option value="5">Friday</option>
                                        <option value="6">Saturday</option>
                                        <option value="7">Sunday</option>
                                    </select>
                                    <br />
                                    <label>Time&nbsp;</label>
                                    <input ref={register} name="time" />
                                    <br />
                                    <button>Submit</button>
                                </form>
                            </div>
                        </div>
                    )}
                </Popup>
                <div className="scrolling-container">
                    <table>
                        <th className="taskTable">Event</th>
                        <th className="dayTable">Day</th>
                        <th>Time</th>
                    </table>
                    {current_timetable}
                </div>
            </>
        );
    } else if (page === BLOCK) {
        content = (
            <>
                <div className="title">
                    <h1>organise - Block</h1>
                </div>
            </>
        );
    } else if (page === SETTINGS) {
        content = (
            <>
                <div className="title">
                    <h1>organise - Settings</h1>
                </div>
            </>
        );
    }
    return (
        <div className='App'>
            <div className="navigation">
                <button onClick={() => changeContent(setPage, HOME)}>Home</button>
                <button onClick={() => changeContent(setPage, TODO)}>To Do</button>
                <button onClick={() => changeContent(setPage, TIMETABLE)}>Timetable</button>
                <button onClick={() => changeContent(setPage, BLOCK)}>Block</button>
                <button onClick={() => changeContent(setPage, SETTINGS)}>Settings</button>
            </div>
            <div className="main-container">
                {content}
            </div>
        </div>
    );
};

function compare(a, b) {
    const compareA = a.priority.toUpperCase();
    const compareB = b.priority.toUpperCase();
    let comparison = 0;
    if (compareA > compareB) {
        comparison = 1;
    } else if (compareA < compareB) {
        comparison = -1;
    }
    return comparison;
}

export default App;
