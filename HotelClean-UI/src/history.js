import { createBrowserHistory } from 'history';
import { createMemoryHistory } from 'history';
import canUseDOM  from 'can-use-dom';

let history;
const getHistory = (initialPath) => {
    if (!canUseDOM) {
        history = createMemoryHistory({
            initialEntries: [initialPath],
        })
    }
    else {
        history = createBrowserHistory();
    }
    return history;
};
export default getHistory;

