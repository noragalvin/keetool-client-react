/**
 * Created by phanmduong on 4/6/17.
 */
import * as types from '../../constants/actionTypes';
import * as registerStudentsApi from './registerStudentsApi';
import {showErrorNotification}from '../../helpers/helper';

export function loadRegisterStudent(page, genId, search) {
    return function (dispatch) {
        dispatch({
            type: types.BEGIN_DATA_REGISTER_LIST_LOAD,
        });
        registerStudentsApi.getRegisterStudent(page, genId, search).then(function (res) {
            dispatch(loadDataSuccessful(res));
        }).catch(error => {
            console.log(error);
            dispatch({
                type: types.LOAD_DATA_REGISTER_LIST_ERROR
            });
        });
    };
}

export function loadDataSuccessful(res) {
    return ({
        type: types.LOAD_DATA_REGISTER_LIST_SUCCESSFUL,
        registers: res.data.registers,
        currentPage: res.data.paginator.current_page,
        totalPages: res.data.paginator.total_pages,
        isLoading: false,
        error: false,
    });
}

export function loadGensData() {
    return function (dispatch) {
        dispatch({type: types.BEGIN_LOAD_GENS_REGISTER_STUDENT});
        registerStudentsApi.loadGens()
            .then((res) => {
                dispatch({
                    type: types.LOAD_GENS_REGISTER_STUDENT_SUCCESSFUL,
                    gens: res.data.gens,
                    isLoading: false,
                    error: false
                });
            })
            .catch(() => {
                dispatch({type: types.LOAD_GENS_REGISTER_STUDENT_ERROR});
            });
    };
}

export function loadHistoryCallStudent(studentId, registerId) {
    return function (dispatch) {
        dispatch({
            type: types.BEGIN_LOAD_HISTORY_CALL_STUDENT,
        });
        registerStudentsApi.historyCallStudent(studentId, registerId)
            .then((res) => {
                dispatch({
                    type: types.LOAD_HISTORY_CALL_STUDENT_SUCCESS,
                    historyCall: res.data.data.history_call,
                    registerId: registerId,
                    telecallId: res.data.data.telecall_id
                });
            })
            .catch(() => {
                dispatch({
                    type: types.LOAD_HISTORY_CALL_STUDENT_ERROR,
                });
            });
    };

}

export function changeCallStatusStudent(callStatus, studentId, telecallId, genId, note, closeModal, callerId) {
    return function (dispatch) {
        dispatch({
            type: types.BEGIN_CHANGE_CALL_STATUS_STUDENT
        });
        registerStudentsApi.changeCallStatusStudent(callStatus, studentId, telecallId, genId, note, callerId)
            .then((res) => {
                closeModal();
                dispatch({
                    type: types.CHANGE_CALL_STATUS_STUDENT_SUCCESS,
                    callStatus: res.data.data.call_status,
                    studentId: studentId
                });
            })
            .catch(() => {
                showErrorNotification('Có lỗi xảy ra');
                dispatch({
                    type: types.CHANGE_CALL_STATUS_STUDENT_ERROR
                });
            });
    };
}

