import {combineReducers} from 'redux';
import loginReducer from '../modules/login/loginReducer';
import tabsReducer from '../modules/tab/tabsReducer';
import staffsReducer from '../modules/manageStaff/staffsReducer';
import rolesReducer from '../modules/role/rolesReducer';
import baseListReducer from '../modules/bases/baseListReducer';
import * as types from '../constants/actionTypes';
import taskReducer from "../modules/tasks/taskReducer";
import registerReducer from "../modules/registerStudents/registerReducer";
import emailTemplatesReducer from "../modules/emailTemplates/emailTemplatesReducer";
import emailFormsReducer from "../modules/emailForms/emailFormsReducer";
import blogReducer from '../modules/blog/blogReducer';
import profileReducer from '../modules/profile/profileReducer';
import studySessionReducer from '../modules/studySession/studySessionReducer';
import scheduleClassReducer from '../modules/scheduleClass/scheduleClassReducer';
import gensReducer from '../modules/gens/gensReducer';
import studentReducer from '../modules/infoStudent/studentReducer';
import personalCalendarReducer from '../modules/tasks/calendar/personalCalendarReducer';
import dashboardReducer from '../modules/dashboard/dashboardReducer';
import notificationReducer from '../modules/notification/notificationReducer';
import collectMoneyReducer from '../modules/collectMoney/collectMoneyReducer';
import historyCollectMoneyReducer from '../modules/historyCollectMoney/historyCollectMoneyReducer';
import historyCallsReducer from '../modules/historyCalls/historyCallsReducer';
import classesReducer from '../modules/classes/classesReducer';
import ruleReducer from '../modules/rule/ruleReducer';
import cardFilterReducer from "../modules/tasks/board/filter/cardFilterReducer";
import emailSubscribersListReducer from "../modules/emailSubscribersList/emailSubscribersListReducer";
import bookReducer from "../modules/book/bookReducer";
import emailCampainsReducer from "../modules/emailCampaigns/emailCampainsReducer";
import goodReducer from "../modules/good/goodReducer";
import shiftRegistersReducer from "../modules/shiftRegisters/shiftRegistersReducer";
import historyShiftRegistersReducer from "../modules/historyShiftRegisters/historyShiftRegistersReducer";
import shiftSessionsReducer from "../modules/shiftSessions/shiftSessionsReducer";
import courseReducer from "../modules/courses/coursesReducer";
import categoriesReducer from "../modules/categories/categoriesReducer";
import goodOrdersReducer from "../modules/goodOrders/goodOrdersReducer";
import productListReducer from "../modules/productList/productListReducer";
import importGoodsReducer from "../modules/importGoods/importGoodsReducer";
import wareHouseReducer from "../modules/wareHouse/wareHouseReducer";
import customerReducer from "../modules/customer/customerReducer";
import inventoryGoodReducer from "../modules/inventoryGood/inventoryGoodReducer";
import createProductReducer from "../modules/createProduct/createProductReducer";


const appReducer = combineReducers({
    login: loginReducer,
    tabs: tabsReducer,
    staffs: staffsReducer,
    roles: rolesReducer,
    baseList: baseListReducer,
    task: taskReducer,
    emailTemplates: emailTemplatesReducer,
    emailForms: emailFormsReducer,
    blog: blogReducer,
    registerStudents: registerReducer,
    profile: profileReducer,
    studySession: studySessionReducer,
    scheduleClass: scheduleClassReducer,
    gens: gensReducer,
    infoStudent: studentReducer,
    personalCalendar: personalCalendarReducer,
    dashboard: dashboardReducer,
    notification: notificationReducer,
    collectMoney: collectMoneyReducer,
    historyCollectMoney: historyCollectMoneyReducer,
    historyCalls: historyCallsReducer,
    classes: classesReducer,
    cardFilter: cardFilterReducer,
    rule: ruleReducer,
    emailSubscribersList: emailSubscribersListReducer,
    book: bookReducer,
    emailCampaigns: emailCampainsReducer,
    good: goodReducer,
    shiftRegisters: shiftRegistersReducer,
    historyShiftRegisters: historyShiftRegistersReducer,
    shiftSessions: shiftSessionsReducer,
    courses: courseReducer,
    categories : categoriesReducer,
    goodOrders: goodOrdersReducer,
    productList: productListReducer,
    importGoods: importGoodsReducer,
    wareHouses : wareHouseReducer ,
    customers : customerReducer,
    inventoryGood: inventoryGoodReducer,
    createProduct: createProductReducer
});

const rootReducer = (state, action) => {
    if (action.type === types.LOG_OUT) {
        state = {};
    }

    return appReducer(state, action);
};

export default rootReducer;
