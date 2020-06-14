import axios from 'axios';
import { createAction } from 'redux-actions';
const { sign } = require("jsonwebtoken");
axios.defaults.withCredentials = true;

export const createActionByType = (actionName) => createAction(actionName);
export const fetch = async (requestDetails, JWT_TOKEN) => {
    const { url, method = 'get', data = {} } = requestDetails;
    try {

        let headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'jwt-token': JWT_TOKEN,
             Accept: 'application/json',
        };

        const { data: result } = await axios({
            url,
            method,
            data,
            headers
        });
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const createToken = async (secret) => {
    return await sign({ email: 'jean-brice.rougeot@consensys.net' }, "91c9988e-ab0f-45b0-aec5-668657a12421", {
        expiresIn: '60000',
    });
}
