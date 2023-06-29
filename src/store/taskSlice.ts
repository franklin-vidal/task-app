import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { Task } from "../types";

const initialState: Array<Task> = [];

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    save: (state, action) => {
      const task = action.payload;
      if (task.id === "") {
        const toSaveTask: Task = {
          id: uuidv4(),
          title: task.title,
          description: task.description,
          createdAt: new Date().toISOString(),
          isCompleted: false,
        };
        state.unshift(toSaveTask);
      } else {
        return state.map((taskToUpdate: Task) =>
          taskToUpdate.id === task.id
            ? { ...task, createdAt: new Date().toISOString() }
            : taskToUpdate
        );
      }
    },
    remove: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
    setCompleted: (state, action) => {
      const { id, isCompleted } = action.payload;
      return state.map((task: Task) =>
        task.id === id ? { ...task, isCompleted } : task
      );
    },
    orderBy: (state, action) => {
      if (action.payload === "asc") {
        return state.sort((a: Task, b: Task) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);

          if (aDate.getTime() > bDate.getTime()) {
            return 1;
          }
          if (aDate.getTime() < bDate.getTime()) {
            return -1;
          }
          return 0;
        });
      }
      if (action.payload === "desc") {
        return state.sort((a: Task, b: Task) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);

          if (aDate.getTime() < bDate.getTime()) {
            return 1;
          }
          if (aDate.getTime() > bDate.getTime()) {
            return -1;
          }
          return 0;
        });
      }
    },
  },
});

export const { save, remove, setCompleted, orderBy } = tasksSlice.actions;
export default tasksSlice.reducer;
