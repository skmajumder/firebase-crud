import { useEffect, useState } from "react";
import "./App.css";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import db from "./firebase/firebase.config";

function App() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUuid, setTempUuid] = useState("");

  // * Read
  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      setInput([]);
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.values(data);
        setTasks(dataArray);
        // Object.values(data).map((data) =>
        //   setTasks((oldTask) => [...oldTask, data])
        // );
      }
    });
  }, []);

  const handleTodo = (e) => {
    setInput(e.target.value);
  };

  // * Write DB
  const writeToDatabase = () => {
    const uuid = uid();
    set(ref(db, `/${uuid}`), {
      todo: input,
      uuid,
    });

    setInput("");
  };

  // * Delete tasks
  const handleDelete = (todo) => {
    remove(ref(db, `/${todo.uuid}`));
  };

  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTempUuid(todo.uuid);
    setInput(todo.todo);
  };

  const handleCloseUpdate = () => {
    setIsEdit(false);
    setInput("");
  };

  const handleSubmitChange = () => {
    update()
  };

  return (
    <>
      <div className="container px-10">
        <div className="form mb-4">
          <label className="label">
            <span className="label-text">Write Task</span>
          </label>
          <input
            type="text"
            value={input}
            onChange={handleTodo}
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs mb-2"
          />
          <br />
          {isEdit ? (
            <>
              <button
                onClick={handleSubmitChange}
                className="btn btn-primary btn-sm"
                type="submit"
              >
                Update
              </button>
              <button
                onClick={handleCloseUpdate}
                className="btn btn-primary btn-sm"
                type="submit"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                onClick={writeToDatabase}
                className="btn btn-primary btn-sm"
                type="submit"
              >
                Submit
              </button>
            </>
          )}
        </div>
        <div className="task-list">
          <h3 className="text-4xl font-semibold mb-4">Tasks</h3>
          {tasks.map((task, index) => (
            <div key={index} className="task-list mb-5">
              <h3 className="text-xl font-semibold mb-2">
                {index + 1}: {task.todo}
              </h3>
              <button
                onClick={() => handleUpdate(task)}
                className="btn btn-outline btn-accent btn-sm"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(task)}
                className="btn btn-outline btn-error btn-sm ml-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
