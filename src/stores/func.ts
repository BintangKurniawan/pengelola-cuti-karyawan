export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getData(
    state: string,
    key: string | number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default_value: any,
    type = 'local'
  ) {
    if (type == 'local') {
      const data = localStorage.getItem(state);
      if (data) return JSON.parse(data)[key];
      else {
        localStorage.setItem(state, JSON.stringify(default_value));
        return default_value[key];
      }
    } else {
      const data = sessionStorage.getItem(state);
      if (data) return JSON.parse(data)[key];
      else {
        sessionStorage.setItem(state, JSON.stringify(default_value));
        return default_value[key];
      }
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveData(
    state: string,
    key: string | number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default_data: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    type = 'local'
  ) {
    let data = default_data;
    let raw = null;
    if (type == 'local') raw = localStorage.getItem(state);
    else raw = sessionStorage.getItem(state);

    if (raw) data = JSON.parse(raw);
    data[key] = value;

    if (type == 'session') sessionStorage.setItem(state, JSON.stringify(data));
    else localStorage.setItem(state, JSON.stringify(data));

    if (data) return data[key];
    else return default_data[key];
  },
};
