const { ERROR_CODES } = require('shr-utils/lib/shr-utils.min');

export const isJWTError = ({ success = true, errorCode  }) => {
    if (!success && Object.values(ERROR_CODES).find((code) => (code === errorCode))) {
        return true;
    }
    return false;
}
