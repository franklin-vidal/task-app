import {
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useForm } from "react-hook-form";
import { useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppAction, AppReducer, Task } from "./types";
import {
  save as saveTask,
  remove as removeTask,
  setCompleted as setCompletedTask,
  orderBy as orderByTask,
} from "./store/taskSlice";
import "./App.css";

const initialCurrentTask: Task = {
  id: "",
  title: "",
  description: "",
  createdAt: "",
  isCompleted: false,
};

const initialState: AppReducer = {
  currentTask: initialCurrentTask,
  showModal: false,
  isActiveFilter: "",
};

const reducer = (state: AppReducer, action: AppAction) => {
  switch (action.type) {
    case "HANDLE_MODAL":
      return { ...state, showModal: !state.showModal };
    case "RESET_CURRENT_TASK":
      return { ...state, currentTask: initialCurrentTask };
    case "SET_CURRENT_TASK":
      return { ...state, currentTask: action.task };
    case "SET_ACTIVE_FILTER":
      return { ...state, isActiveFilter: action.isActiveFilter };
    default:
      return state;
  }
};

function App() {
  const dispatch = useDispatch();
  const tasks: Array<Task> = useSelector((state: any) => state.tasks);
  const [appState, appDispatch] = useReducer(reducer, initialState);

  type Inputs = {
    title: string;
    description: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const showModalHandler = () => {
    appDispatch({ type: "HANDLE_MODAL" });
  };
  const handleSave = () => {
    dispatch(saveTask(appState.currentTask));
    appDispatch({ type: "HANDLE_MODAL" });
    appDispatch({ type: "RESET_CURRENT_TASK" });
  };
  const handleEdit = (task: Task) => {
    appDispatch({ type: "RESET_CURRENT_TASK" });
    appDispatch({ type: "SET_CURRENT_TASK", task: task });
    appDispatch({ type: "HANDLE_MODAL" });
  };
  const handleCancel = () => {
    appDispatch({ type: "HANDLE_MODAL" });
    appDispatch({ type: "RESET_CURRENT_TASK" });
  };
  const handleCompleted = (task: Task, isCompleted: boolean) => {
    dispatch(setCompletedTask({ id: task.id, isCompleted }));
  };
  const handleIsActiveFilter = (event: SelectChangeEvent<string>) => {
    appDispatch({
      type: "SET_ACTIVE_FILTER",
      isActiveFilter: event.target.value,
    });
  };
  const handleDelete = (taskId: string) => {
    dispatch(removeTask(taskId));
    appDispatch({ type: "RESET_CURRENT_TASK" });
  };
  const handleOrder = (event: SelectChangeEvent<string>) => {
    dispatch(orderByTask(event.target.value));
  };
  const handleInputChange = (event: any) =>
    appDispatch({
      type: "SET_CURRENT_TASK",
      task: {
        ...appState.currentTask,
        [event.currentTarget.name]: event.currentTarget.value,
      },
    });

  const filteredTaks = tasks.filter((task: Task) => {
    switch (appState.isActiveFilter) {
      case "finished":
        return task.isCompleted === true;
      case "unfinished":
        return task.isCompleted === false;
      default:
        return true;
    }
  });

  return (
    <Container maxWidth="md">
      <Stack spacing={2} sx={{ marginTop: "1rem" }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Stack direction="row" spacing={1}>
              <Select
                defaultValue="Selecione"
                size="small"
                style={{ width: 120 }}
                onChange={handleIsActiveFilter}
                sx={{ height: 37 }}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="unfinished">Pendentes</MenuItem>
                <MenuItem value="finished">Concluídas</MenuItem>
              </Select>
              <Select
                defaultValue="asc"
                style={{ width: 120 }}
                onChange={handleOrder}
                sx={{ height: 37 }}
              >
                <MenuItem value="asc">Mais recentes</MenuItem>
                <MenuItem value="desc">Mais antigas</MenuItem>
              </Select>
            </Stack>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              onClick={showModalHandler}
              variant="contained"
              endIcon={<AddCircleOutlineOutlinedIcon />}
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>

        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: ".5rem",
            padding: ".7rem",
          }}
        >
          {filteredTaks.length === 0 && (
            <Box
              component="span"
              sx={{
                border: "1px dashed lightgray",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 3,
              }}
            >
              <Inventory2OutlinedIcon sx={{ color: "lightgray" }} />
              <Typography
                component="span"
                variant="body1"
                sx={{ color: "lightgray" }}
              >
                Sem registros!
              </Typography>
            </Box>
          )}
          <Stack spacing={1}>
            {filteredTaks.map((task: Task) => (
              <ListItem
                key={task.id}
                secondaryAction={
                  <Stack direction="row" spacing={2}>
                    <IconButton
                      onClick={() => handleEdit(task)}
                      edge="end"
                      aria-label="edit"
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(task.id)}
                      edge="end"
                      aria-label="delete"
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </Stack>
                }
                sx={{
                  border: "1px solid lightgray",
                  borderRadius: ".5rem",
                  p: 0,
                }}
              >
                <ListItemButton role={undefined}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={task.isCompleted}
                      tabIndex={-1}
                      disableRipple
                      onChange={() => handleCompleted(task, !task.isCompleted)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    onClick={() => handleEdit(task)}
                    primary={
                      <Typography
                        sx={task.isCompleted ? lineThroughStyle : null}
                        variant="h6"
                      >
                        {task.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={task.isCompleted ? lineThroughStyle : null}
                        variant="body2"
                      >
                        {task.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Stack>
        </List>
      </Stack>
      <Modal
        open={appState.showModal}
        onClose={handleCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="div" sx={modalStyle}>
          <form onSubmit={handleSubmit(handleSave)}>
            <Stack>
              <TextField
                name="title"
                fullWidth={true}
                {...(register("title"),
                {
                  required: true,
                  value: appState.currentTask.title,
                  onChange: handleInputChange,
                })}
                placeholder="Título da tarefa..."
              />
              {errors.title && <span>This field is required</span>}
              <TextField
                name="description"
                fullWidth={true}
                {...(register("description"),
                {
                  required: true,
                  value: appState.currentTask.description,
                  onChange: handleInputChange,
                })}
                multiline
                rows={2}
                placeholder="Descrição da tarefa..."
              />
            </Stack>
            <Box
              component="div"
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button onClick={handleCancel}>Cancelar</Button>
              <Button type="submit" variant="contained">
                Salvar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}
const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 275,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  "& .MuiTextField-root": { m: 1, width: "25ch" },
};
const lineThroughStyle = {
  textDecoration: "line-through",
};
export default App;
