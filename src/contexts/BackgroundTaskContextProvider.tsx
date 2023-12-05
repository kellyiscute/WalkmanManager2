import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Map } from "immutable";

export interface BackgroundTaskContextValue {
  addTask: (description: string, task: () => Promise<void>) => void;
  getTasks: () => BackgroundTask[];
  taskList: BackgroundTask[];
}

export interface BackgroundTask {
  id: number;
  taskDescription: string;
  startTime: number;
}

export const backgroundTaskContext = createContext<BackgroundTaskContextValue>(null!);

const BackgroundTaskContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const taskCounter = useRef<number>(0);
  const [tasks, setTasks] = useState(Map<number, BackgroundTask>());

  const taskList = useMemo(() => tasks.valueSeq().toArray(), [tasks]);

  const addTask = useCallback((description: string, task: () => Promise<void>) => {
    const id = taskCounter.current++;
    setTasks((tasks) => tasks.set(id, { id, taskDescription: description, startTime: Date.now() }));
    task().then(() => {
      setTasks((tasks) => tasks.delete(id));
    });
  }, []);

  const getTasks = useCallback(() => {
    return tasks.valueSeq().toArray();
  }, [tasks]);

  return (
    <backgroundTaskContext.Provider value={{ addTask, getTasks, taskList }}>
      {children}
    </backgroundTaskContext.Provider>
  );
};

export default BackgroundTaskContextProvider;
