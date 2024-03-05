export default {
  getData(
    state: string,
    key: string | number,
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

  saveData(
    state: string,
    key: string | number,
    default_data: any,
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
