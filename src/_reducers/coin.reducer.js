import coinConstants from '../_constants/coin.constants';


const coinReducer = (state = {}, action) => {
  switch (action.type) {
    case coinConstants.CREATE_REQUEST:
      return {
        ...state,
        createLoading: true,
      };
    case coinConstants.CREATE_SUCCESS:
      return {
        ...state,
        createCoin: action.coin,
      };
    case coinConstants.CREATE_FAILURE:
      return {
        ...state,
        createErrors: action.errors,
      };
    case coinConstants.DETAIL_REQUEST:
      return {
        ...state,
        detailLoading: true,
      };
    case coinConstants.DETAIL_SUCCESS:
      return {
        ...state,
        detailLoading: false,
        detailCoin: action.coin,
      };
    case coinConstants.DETAIL_FAILURE:
      return {
        ...state,
        detailLoading: false,
        detailErrors: action.errors,
      };
    case coinConstants.CLEAR:
      return {
      };
    default:
      return state;
  }
};

export default coinReducer;
