let nextId = -1;

const generateId = jest.fn(() => {
  nextId += 1;
  return nextId;
});
export default generateId;
