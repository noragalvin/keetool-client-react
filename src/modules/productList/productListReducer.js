import * as types from '../../constants/actionTypes';
import initialState from '../../reducers/initialState';

export default function productListReducer(state = initialState.productList, action) {

    switch (action.type) {
        case types.LOAD_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.products,
                isLoading: false
            };
        case types.TOGGLE_PRICE_MODAL:
            return {
                ...state,
                modalInProduct: {
                    priceModal: !state.modalInProduct.priceModal
                }
            };
        case types.BEGIN_LOAD_PRODUCTS:
            return {
                ...state,
                isLoading: true
            };
        case types.HANDLE_PRODUCT:
            return {
                ...state,
                productEditing: {
                    ...state.productEditing,
                    productPresent: action.product
                }
            };
        case types.UPDATING_PRODUCT_LIST_MODAL:
            return {
                ...state,
                modalInProduct: {
                    ...state.modalInProduct,
                    isModalUpdating: action.updating
                }
            };
        case types.UPDATED_PRODUCT_LIST_MODAL:
            return {
                ...state,
                modalInProduct: {
                    ...state.modalInProduct,
                    modalUpdated: action.modalUpdated
                }
            };
        case types.TOGGLE_WARE_HOUSE_MODAL:
            return {
                ...state,
                modalInProduct: {
                    wareHouseModal: !state.modalInProduct.wareHouseModal
                }
            };
        case types.TOGGLE_AVATAR_MODAL:
            return {
                ...state,
                modalInProduct: {
                    avatarModal: !state.modalInProduct.avatarModal
                }
            };
        case types.UPLOAD_PRODUCT_AVATAR_COMPLETE:
            return {
                ...state,
                productEditing: {
                    ...state.productEditing,
                    productPresent: {
                        ...state.productEditing.productPresent,
                        avatar_url: action.avatar_url
                    },
                    isUploadingAvatar: false
                }
            };
        case types.BEGIN_UPLOAD_PRODUCT_AVATAR:
            return {
                ...state,
                productEditing: {
                    ...state.productEditing,
                    isUploadingAvatar: true
                }
            };
        case types.UPDATE_PRODUCT_AVATAR_PROGRESS:
            return {
                ...state,
                productEditing: {
                    ...state.productEditing,
                    percent: action.percent
                }
            };
        case types.GET_CATEGORIES_PRODUCTS_LIST:
            return {
                ...state,
                categories: action.categories
            };
        case types.GET_MANUFACTURES_PRODUCTS_LIST:
            return {
                ...state,
                manufactures: action.manufactures
            };
        default:
            return state;
    }
}