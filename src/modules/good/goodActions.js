/**
 * Created by phanmduong on 4/6/17.
 */
import * as types from '../../constants/actionTypes';
import * as goodApi from './goodApi';
import {uploadFile} from '../file/fileApi';
import {showErrorNotification, showNotification} from "../../helpers/helper";
import {browserHistory} from 'react-router';

// import _ from 'lodash';
/*eslint no-console: 0 */
export function loadGoods(page = 1, query = null) {
    return function (dispatch) {
        dispatch({
            type: types.BEGIN_LOAD_GOODS
        });
        goodApi.loadGoods(page, query)
            .then((res) => {
                dispatch({
                    type: types.LOAD_GOODS_SUCCESS,
                    goods: res.data.goods,
                    currentPage: res.data.paginator.current_page,
                    totalPages: res.data.paginator.total_pages
                });
            });

    };
}

export function updateGoodFormData(good) {
    return function (dispatch) {
        dispatch({
            type: types.UPDATE_GOOD_FORM_DATA,
            good
        });
    };
}


export function uploadAvatar(file) {
    return function (dispatch) {
        const error = () => {
            showErrorNotification("Có lỗi xảy ra");
        };
        const completeHandler = (event) => {
            const data = JSON.parse(event.currentTarget.responseText);
            console.log(data);
            showNotification("Tải lên ảnh đại diện thành công");
            dispatch({
                type: types.UPLOAD_GOOD_AVATAR_COMPLETE,
                avatar_url: data.link
            });
        };
        const progressHandler = (event) => {
            const percentComplete = Math.round((100 * event.loaded) / event.total);
            dispatch({
                type: types.UPDATE_GOOD_AVATAR_PROGRESS,
                percent: percentComplete
            });
        };

        dispatch({
            type: types.BEGIN_UPLOAD_GOOD_AVATAR
        });

        goodApi.uploadAvatar(file,
            completeHandler, progressHandler, error);
    };
}

export function uploadCover(file) {
    return function (dispatch) {
        const error = () => {
            showErrorNotification("Có lỗi xảy ra");
        };
        const completeHandler = (event) => {
            const data = JSON.parse(event.currentTarget.responseText);
            console.log(data);
            showNotification("Tải lên ảnh nền thành công");
            dispatch({
                type: types.UPLOAD_COVER_SUCCESS,
                coverUrl: data.link
            });
        };
        const progressHandler = (event) => {
            const percentComplete = Math.round((100 * event.loaded) / event.total);
            dispatch({
                type: types.UPDATE_UPLOAD_COVER_PROGRESS,
                percentCover: percentComplete
            });
        };

        dispatch({
            type: types.BEGIN_UPLOAD_COVER
        });

        goodApi.uploadAvatar(file,
            completeHandler, progressHandler, error);
    };
}

export function addUrlSuccess(file) {
    return function (dispatch) {
        dispatch({
            type: types.ADD_GOOD_URL_SUCCESS,
            file
        });
    };
}


export function saveGood(good) {
    return function (dispatch) {
        dispatch({
            type: types.BEGIN_SAVE_GOOD
        });

        goodApi.saveGood(good)
            .then(() => {
                browserHistory.push("/good/all");
                showNotification("Thêm sản phẩm thành công");
                dispatch({
                    type: types.SAVE_GOOD_SUCCESS
                });
            });
    };
}


export function loadGood(goodId) {
    return function (dispatch) {
        dispatch({
            type: types.BEGIN_LOAD_GOOD_DETAIL
        });

        goodApi.loadGood(goodId)
            .then((res) => {
                dispatch({
                    type: types.LOAD_GOOD_DETAIL_SUCCESS,
                    good: res.data.data.good
                });
            });
    };
}

export function uploadFiles(fileWrapper) {
    return function (dispatch) {
        const error = () => {
            showErrorNotification("Có lỗi xảy ra");
        };
        const completeHandler = (event) => {
            const file = JSON.parse(event.currentTarget.responseText);
            showNotification("Tải lên tập tin đính kèm thành công");
            dispatch({
                type: types.UPLOAD_GOOD_FILES_SUCCESS,
                file
            });
        };
        const progressHandler = (event) => {
            const percentComplete = Math.round((100 * event.loaded) / event.total);
            dispatch({
                type: types.UPDATE_UPLOAD_GOOD_FILES_PROGRESS,
                progress: percentComplete,
                fileWrapper
            });
        };

        dispatch({
            type: types.BEGIN_UPLOAD_GOOD_FILES,
            fileWrapper
        });

        uploadFile(fileWrapper.index, fileWrapper.file,
            completeHandler, progressHandler, error);
    };
}

export function loadGoodPropertyItems(page = 1, query = "", type = "") {
    return function (dispatch) {
        dispatch({
            type: types.BEGIN_LOAD_GOOD_PROPERTY_ITEMS
        });
        goodApi.loadGoodPropertyItems(page, query, type)
            .then((res) => {
                dispatch({
                    type: types.LOAD_GOOD_PROPERTY_ITEMS_SUCCESS,
                    propertyItems: res.data.good_property_items,
                    totalPages: res.data.paginator.total_pages,
                    currentPage: res.data.paginator.current_page
                });
            });
    };
}

export function deletePropertyItem(id) {
    return function (dispatch) {
        dispatch({
            type: types.DELETE_GOOD_PROPERTY_ITEM,
            id
        });
        goodApi.deletePropertyItem(id);
    };
}