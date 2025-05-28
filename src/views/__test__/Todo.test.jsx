import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Todo from "../Todo";
import { BrowserRouter } from "react-router-dom";

const mockPost = jest.fn();

beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});


jest.mock("jwt-decode", () => () => ({ user_id: 1 }));

jest.mock("../../utils/useAxios", () => {
  const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  };
  return {
    __esModule: true,
    default: () => mockAxios,
    baseURL: "http://localhost:8000/api",
  };
});


const useAxios = require("../../utils/useAxios").default;
const mockAxios = useAxios();

beforeEach(() => {
  localStorage.setItem(
    "authTokens",
    JSON.stringify({
      access: "fakeToken",
    })
  );
  jest.clearAllMocks();
});

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

test("renders input and button", async () => {
  mockAxios.get.mockResolvedValue({ data: [] });
  renderWithRouter(<Todo />);
  expect(await screen.findByPlaceholderText(/write a todo/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /add todo/i })).toBeInTheDocument();
});

test("loads and displays todo list", async () => {
  mockAxios.get.mockResolvedValue({
    data: [{ id: 1, title: "Test task", completed: false }],
  });
  renderWithRouter(<Todo />);
  expect(await screen.findByText("Test task")).toBeInTheDocument();
});

test("handles input change", async () => {
  mockAxios.get.mockResolvedValue({ data: [] });
  renderWithRouter(<Todo />);
  const input = await screen.findByPlaceholderText(/write a todo/i);
  fireEvent.change(input, { target: { value: "New Task", name: "title" } });
  expect(input.value).toBe("New Task");
});

test("adds a new todo", async () => {
  mockAxios.get.mockResolvedValueOnce({ data: [] });
  mockAxios.post.mockResolvedValueOnce({ data: { title: "New Task" } });
  mockAxios.get.mockResolvedValueOnce({
    data: [{ id: 1, title: "New Task", completed: false }],
  });

  renderWithRouter(<Todo />);
  const input = await screen.findByPlaceholderText(/write a todo/i);
  fireEvent.change(input, { target: { value: "New Task", name: "title" } });

  const addButton = screen.getByRole("button", { name: /add todo/i });
  fireEvent.click(addButton);

  await waitFor(() =>
    expect(screen.getByText("New Task")).toBeInTheDocument()
  );
});

test("deletes a todo", async () => {
  mockAxios.get.mockResolvedValueOnce({
    data: [{ id: 1, title: "To Delete", completed: false }],
  });
  mockAxios.delete.mockResolvedValue({}); 
  mockAxios.get.mockResolvedValueOnce({ data: [] });

  renderWithRouter(<Todo />);
  const deleteButton = await screen.findByLabelText("delete-task");
fireEvent.click(deleteButton);

  
  await waitFor(() =>
    expect(mockAxios.delete).toHaveBeenCalledWith(
      "http://localhost:8000/api/todo-detail/1/1/"
    )
  );
});

test("formSubmit handles api.post error (catch block)", async () => {
  const error = new Error("Network error");

  mockAxios.post.mockRejectedValueOnce(error);

  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  renderWithRouter(<Todo />);

  const input = await screen.findByPlaceholderText(/write a todo/i);
  fireEvent.change(input, { target: { value: "Test error task", name: "title" } });

  const addButton = screen.getByRole("button", { name: /add todo/i });
  fireEvent.click(addButton);

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith(error);
  });

  consoleSpy.mockRestore();
});


test("marks a todo as completed", async () => {
  mockAxios.get.mockResolvedValueOnce({
    data: [{ id: 2, title: "To Complete", completed: false }],
  });
  mockAxios.patch.mockResolvedValue({});
  mockAxios.get.mockResolvedValueOnce({
    data: [{ id: 2, title: "To Complete", completed: true }],
  });

  renderWithRouter(<Todo />);
  const completeButton = await screen.findByLabelText("complete-task");
fireEvent.click(completeButton);

  await waitFor(() =>
    expect(mockAxios.patch).toHaveBeenCalledWith(
      "http://localhost:8000/api/todo-completed/1/2/"
    )
  );
});

test("applies 'line-through text-gray-400' class when todo.completed is true", async () => {
  const todos = [{ id: 1, title: "Completed Task", completed: true }];

  mockAxios.get.mockResolvedValueOnce({ data: todos });

  renderWithRouter(<Todo />);

  const todoElement = await screen.findByText("Completed Task");

  const container = todoElement.closest('div');

  expect(container).toHaveClass('line-through');
  expect(container).toHaveClass('text-gray-400');
});

test("does not apply 'line-through text-gray-400' class when todo.completed is false", async () => {
  const todos = [{ id: 2, title: "Incomplete Task", completed: false }];

  mockAxios.get.mockResolvedValueOnce({ data: todos });

  renderWithRouter(<Todo />);

  const todoElement = await screen.findByText("Incomplete Task");

  const container = todoElement.closest('div');

  expect(container).not.toHaveClass('line-through');
  expect(container).not.toHaveClass('text-gray-400');
});
