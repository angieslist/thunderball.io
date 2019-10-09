export async function fetchTodos() {
  const res = await fetch('/todos-api/todos', { allowOnServer: true });
  return res.json();
}

export default fetchTodos;
