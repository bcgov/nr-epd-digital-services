

  export const loadFromLocalStorage = () => {
    try {
      const stateStr =  sessionStorage.getItem('state');
      return stateStr ? JSON.parse(stateStr) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };


  export const saveToLocalStorage = (state) => {
    try {
      sessionStorage.setItem('state', JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  };