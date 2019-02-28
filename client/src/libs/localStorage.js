export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('kinoStore');
    if (serializedState === null) {
      return {
        apiStore: {}
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('kinoStore', serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};