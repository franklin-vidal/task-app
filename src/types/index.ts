export type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isCompleted: boolean;
};

export type AppReducer = {
  currentTask: Task;
  showModal: boolean;
  isActiveFilter: string;
};

export type AppAction =
  | { type: "HANDLE_MODAL" }
  | { type: "DECREMENT" }
  | { type: "RESET_CURRENT_TASK" }
  | { type: "SET_CURRENT_TASK"; task: Task }
  | { type: "SET_ACTIVE_FILTER"; isActiveFilter: string };
