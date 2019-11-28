import { coinConstants } from '../_constants';
import { handleErrors } from '../_helpers';

function saveCoin(coin) {
    function request() { return { type: coinConstants.DETAIL_REQUEST }; }
    function success(coin) { return { type: coinConstants.DETAIL_SUCCESS, coin }; }
    function failure(errors) { return { type: coinConstants.DETAIL_FAILURE, errors }; }
  
    return (dispatch) => {
      dispatch(request());
      dispatch(success(coin));
    };
  }

  const coinActions = {
    saveCoin
  };

  export default coinActions;