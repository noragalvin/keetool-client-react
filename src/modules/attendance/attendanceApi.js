import axios from 'axios';
import * as env from '../../constants/env';

export function loadClasses(search='', page = 1, teacherId = '', baseid='' , genid='') {
    // &base_id=&gen_id=
    let url = env.MANAGE_API_URL + "/class/all?search=" + search
        + "&teacher_id=" + teacherId
        + "&page=" + page
        + "&base_id="+ baseid
        + "&gen_id=" + genid;
    let token = localStorage.getItem('token');
    if (token) {
        url += "&token=" + token;
    }
    return axios.get(url);
}

export function loadClassLessonModal(id) {
    //http://api.keetool.xyz/apiv2/class/555/attendance/lessons?token=
    let url = env.API_URL + "/apiv2/class/" + id + "/attendance/lessons";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    return axios.get(url);
}


export function loadLessonDetailModal(classid , lessonid) {
    //http://manageapi.keetool.xyz/v2/course/get-attendance-lesson/120/1?token=
    let url = env.MANAGE_API_URL + "/v2/course/get-attendance-lesson/" + classid + "/" + lessonid;
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    return axios.get(url);
}

export function takeAttendance(classid , lessonid, studentid) {
    //manageapi.keetool.xyz/v2/course/change-attendance/931/1?token=
    let url = env.MANAGE_API_URL + "/v2/course/change-attendance/" + classid + "/" + lessonid;
    let token = localStorage.getItem('token');

    if (token) {
        url += "?token=" + token;
    }
    return axios.post(url, {student_id : studentid});
}


export function loadGens() {
    let url = env.MANAGE_API_URL + "/gen/all";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }

    return axios.get(url);
}

export function loadBases() {
    let url = env.MANAGE_API_URL + "/base/all";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }

    return axios.get(url);
}