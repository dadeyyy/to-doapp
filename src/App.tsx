import { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiPlus, mdiTrashCanOutline, mdiPencil } from '@mdi/js';

type tasksType = {
  id: number;
  task: string;
  done: boolean;
}[];

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState<tasksType>(()=>{
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(()=>{
    localStorage.setItem('tasks', JSON.stringify(tasks));
  },[tasks])

  const handleAddTask = () => {
    if (inputValue !== '') {
      setTasks([
        ...tasks,
        { id: tasks.length + 1, task: inputValue, done: false },
      ]);
      setInputValue('');
    } else {
      alert('Enter a valid input!');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleOnDelete = (taskId: number) => {
    const newTasks = tasks.filter((task) => {
      return task.id != taskId;
    });
    setTasks(newTasks);
  };

  const handleChangeTask = (taskId: number) => {
    const findTask = tasks.find((task) => {
      console.log('Task', task.id);
      console.log('TaskId', taskId);
      return task.id === taskId;
    });

    const newTask = prompt(`Edit task: ${findTask?.task}`);
    if (newTask !== null && newTask !== '') {
      const changedTask = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, task: newTask };
        } else {
          return task;
        }
      });
      setTasks(changedTask);
    }
  };

  const handleCheckBoxClick = (taskId: number) => {
    const setToTrueOrFalse = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, done: !task.done };
      } else {
        return task;
      }
    });

    setToTrueOrFalse.sort((a, b) => Number(a.done) - Number(b.done));

    setTasks(setToTrueOrFalse);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue !== '') {
      setTasks([
        ...tasks,
        { id: tasks.length + 1, task: inputValue, done: false },
      ]);
      setInputValue('');
    }
  };

  return (
    <div className="max-w-screen-sm flex flex-col justify-center items-center mx-auto  p-5 mt-10">
      <div className="flex flex-col gap-3 mb-5 ">
        <h1 className="text-2xl">TO DO:</h1>
        <div className="flex gap-3  items-center">
          <input
            className="border border-black rounded-sm p-2 text-lg"
            onChange={handleInputChange}
            onKeyUp={handleEnter}
            type="text"
            value={inputValue}
            name=""
            id=""
          />
          <button
            className="bg-blue-400 p-1 rounded-md text-white"
            onClick={handleAddTask}
          >
            <Icon path={mdiPlus} size={1} />
          </button>
        </div>
      </div>
      <ul className="flex flex-col gap-3 max-w-full">
        {tasks.length === 0 && <h1>No task!</h1>}
        {tasks.map((task) => {
          return (
            <li
              key={task.id}
              className="flex justify-between items-center gap-5 border border-black p-5 rounded-md "
            >
              <div className="flex items-center gap-5">
                <input
                  onClick={() => handleCheckBoxClick(task.id)}
                  type="checkbox"
                  className="scale-150"
                />
                {task.done ? (
                  <del className="text-slate-400 break-words">{task.task}</del>
                ) : (
                  <p className="break-words">{task.task}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOnDelete(task.id)}
                  className="bg-red-400 p-1 rounded-md text-white"
                >
                  <Icon path={mdiTrashCanOutline} size={1} />
                </button>
                <button
                  onClick={() => handleChangeTask(task.id)}
                  className={`p-1 rounded-md text-white ${
                    task.done ? 'bg-slate-400' : 'bg-blue-400'
                  }`}
                  disabled={task.done}
                >
                  <Icon path={mdiPencil} size={1} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
