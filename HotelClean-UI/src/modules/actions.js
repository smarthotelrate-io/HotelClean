import * as hotel from './hotel';
const removeDefaults = obj =>
  Object.keys(obj).filter(key => key !== 'default').reduce((newObj, key) => {
    if (typeof obj[key] !== 'function') {
      return newObj;
    }
    return {
      [key]: obj[key],
      ...newObj,
    };
  }, {});

export const hotelActions = removeDefaults(hotel);

export default { hotelActions };
