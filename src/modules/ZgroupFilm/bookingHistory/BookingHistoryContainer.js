import React from "react";
import BookingHistoryComponent from "./BookingHistoryComponent";
import Search from "../../../components/common/Search";
import Pagination from "../../../components/common/Pagination";
import Loading from "../../../components/common/Loading";
import {connect} from "react-redux";
import * as bookingHistoryAction from "./bookingHistoryAction";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import {Modal, OverlayTrigger, Panel, Tooltip} from 'react-bootstrap';
import FormInputDate from "../../../components/common/FormInputDate";
import Select from "react-select";
import * as filmAction from "../filmAction";
import * as helper from "../../../helpers/helper";


class BookingHistoryContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            openFilter: false,
            page: 1,
            query: '',
            filter: {
                time: "",
                roomId: "",
                film_name: ''
            },
        };
        this.timeOut = null;
        this.loadOrders = this.loadOrders.bind(this);
        this.bookingHistorySearchChange = this.bookingHistorySearchChange.bind(this);
        this.updateFormFilter = this.updateFormFilter.bind(this);
        this.changTemplateTypes1 = this.changTemplateTypes1.bind(this);
        this.changTemplateTypes2 = this.changTemplateTypes2.bind(this);
        this.showLoadingModal = this.showLoadingModal.bind(this);
        this.closeLoadingModal = this.closeLoadingModal.bind(this);
    }

    componentWillMount() {
        this.props.bookingHistoryAction.getBookingHistory(20);
        this.props.filmAction.loadAllFilms();
        this.props.filmAction.loadAllRooms(20);

    }

    showLoadingModal() {
        this.props.bookingHistoryAction.excelBookingHistory(
            -1,
            null,
            this.state.query,
            this.state.filter.film_name,
            this.state.filter.roomId,
            this.state.filter.time,
            this.closeLoadingModal
        );
    }
    closeLoadingModal() {

        let json = this.props.excel;
        if (!json || json.length === 0) {
            helper.showErrorNotification("Không có dữ liệu");
            return;
        }
        let cols = [{"wch": 3}, {"wch": 16}, {"wch": 20}, {"wch": 10}, {"wch": 22}, {"wch": 8}, {"wch": 4}, {"wch": 8}, {"wch": 8},{"wch": 20},{"wch": 10}];//độ rộng cột
        //begin điểm danh
        json = this.props.excel.map((item, index) => {
            if (item) {
                let res = {
                    'STT': index + 1,
                    'Họ tên': item.user_name,
                    'Email': item.user_email,
                    'Phone':item.user_phone,
                    'Phim': item.film_name,
                    'Phòng': item.room_name,
                    'Ghế': item.seat_name,
                    'Mã giảm giá': item.code,
                    'Tiền (VNĐ)': item.price,
                    'Thời gian đặt vé':item.time,
                    'Loại thanh toán':item.payment_method,

                };
                /* eslint-enable */
                return res;
            }
        });
        let wb = helper.newWorkBook();
        helper.appendJsonToWorkBook(json, wb, 'Danh sách', cols, []);
        helper.saveWorkBookToExcel(wb,
            'Lịch sử đặt vé'
        );
    }
    loadOrders(page = 1) {
        this.setState({page: page});
        this.props.bookingHistoryAction.getBookingHistory(20, page);
    }

    bookingHistorySearchChange(value) {
        this.setState({
            query: value,
            page: 1
        });
        if (this.timeOut !== null) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(function () {
            this.props.bookingHistoryAction.getBookingHistory(
                20,
                this.state.page,
                value,
                this.state.filter.film_name,
                this.state.filter.roomId,
                this.state.filter.time,
            );
        }.bind(this), 500);
    }

    changTemplateTypes1(value) {
        let filter = {
            ...this.state.filter,
            film_name: value.name
        };
        this.setState({filter: filter});
        this.props.bookingHistoryAction.getBookingHistory(
            20,
            this.state.page,
            this.state.query,
            value.name,
            this.state.filter.roomId,
            this.state.filter.time,
        );
    }

    changTemplateTypes2(value) {
        let filter = {
            ...this.state.filter,
            roomId: value.value
        };
        this.setState({filter: filter});
        this.props.bookingHistoryAction.getBookingHistory(
            20,
            this.state.page,
            this.state.query,
            this.state.filter.film_name,
            value.value,
            this.state.filter.time,
        );
    }

    updateFormFilter(event) {
        const field = event.target.name;
        let filter = {...this.state.filter};
        filter[field] = event.target.value;
        if (!helper.isEmptyInput(filter.time)) {
            this.setState({filter: filter, page: 1});
            this.props.bookingHistoryAction.getBookingHistory(
                20,
                this.state.page,
                this.state.query,
                filter.film_name,
                filter.roomId,
                filter.time,
            );
        }
        else {
            this.setState({filter: filter});
        }

    }

    render() {
        const Filter = <Tooltip id="tooltip">Lọc</Tooltip>;
        const Export = <Tooltip id="tooltip">Xuất thành file excel</Tooltip>;
        let first = this.props.totalCount ? (this.props.currentPage - 1) * this.props.limit + 1 : 0;
        let end = this.props.currentPage < this.props.totalPages ? this.props.currentPage * this.props.limit : this.props.totalCount;
        return (
            <div className="card">
                <div className="card-content">
                    <div className="tab-content">
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div style={{display: "flex"}}>
                                <h4 className="card-title">
                                    <strong>Lịch sử đặt vé</strong>
                                </h4>
                                <div>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={Filter}
                                    >
                                        <button
                                            onClick={() => this.setState({openFilter: !this.state.openFilter,})}
                                            className="btn btn-primary btn-round btn-xs button-add none-margin "
                                            disabled={
                                                this.props.isLoadingBookingHistory ||
                                                this.props.isLoadingExcel
                                            }

                                        >
                                            <i className="material-icons"
                                               style={{margin: "0px -4px", top: 0}}
                                            >filter_list</i>
                                        </button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            <div>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={Export}
                                >
                                    <button
                                        onClick={this.showLoadingModal}
                                        className="btn btn-primary btn-round btn-xs button-add none-margin "
                                        disabled={
                                            this.props.isLoadingBookingHistory ||
                                            this.props.isLoadingExcel
                                        }

                                    >
                                        <i className="material-icons"
                                           style={{margin: "0px -4px", top: 0}}
                                        >file_download</i>
                                    </button>
                                </OverlayTrigger>
                            </div>
                        </div>


                        <Search
                            onChange={this.bookingHistorySearchChange}
                            value={this.state.query}
                            placeholder="Nhập tên, email, số điện thoại để tìm kiếm"
                        />
                        <Panel collapsible expanded={this.state.openFilter}>
                            <div className="row">
                                <div className="col-md-4">
                                    <br/>
                                    <label className="label-control">Tên phim</label>
                                    <Select
                                        disabled={false}
                                        value={this.state.filter.film_name}
                                        options={this.props.allFilms.map((film) => {
                                            return {
                                                ...film,
                                                value: film.name,
                                                label: film.name
                                            };
                                        })}
                                        onChange={this.changTemplateTypes1}

                                    />
                                </div>
                                <div className="col-md-4">
                                    <br/>
                                    <label className="label-control">Theo phòng</label>
                                    <Select
                                        value={this.state.filter.roomId}
                                        options={this.props.rooms.map((room) => {
                                            return {
                                                value: room.id,
                                                label: room.base_name + " - " + room.name,
                                            };
                                        })}
                                        onChange={this.changTemplateTypes2}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <FormInputDate
                                        label="Chọn ngày"
                                        name="time"
                                        updateFormData={this.updateFormFilter}
                                        id="form-start-time"
                                        value={this.state.filter.time}
                                    />
                                </div>


                            </div>
                        </Panel>
                        <br/>

                    </div>
                    <div>
                        {
                            this.props.isLoadingBookingHistory ? <Loading/> :
                                <BookingHistoryComponent/>
                        }

                        <br/>
                        <div className="row float-right">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                 style={{textAlign: 'right'}}>
                                <b style={{marginRight: '15px'}}>
                                    Hiển thị kêt quả từ {first}
                                    - {end}/{this.props.totalCount}</b><br/>
                                <Pagination
                                    totalPages={this.props.totalPages}
                                    currentPage={this.props.currentPage}
                                    loadDataPage={this.loadOrders}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    show={this.props.isLoadingExcel}
                    onHide={() => {
                    }}
                >
                    <Modal.Header><h3>{"Đang xuất file..."}</h3></Modal.Header>
                    <Modal.Body><Loading/></Modal.Body>
                </Modal>
            </div>
        );
    }
}

BookingHistoryContainer.propTypes = {
    isLoadingBookingHistory: PropTypes.bool.require,
    isLoadingExcel: PropTypes.bool.require,
    bookingHistoryAction: PropTypes.object.require,
    filmAction: PropTypes.object.require,
    totalCount: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    limit: PropTypes.oneOfType([
        PropTypes.number.isRequired,
        PropTypes.string.isRequired
    ]),
    rooms: PropTypes.array.isRequired,
    allFilms: PropTypes.array.isRequired,
    excel: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
    return {
        isLoadingBookingHistory: state.bookingHistory.isLoadingBookingHistory,
        totalCount: state.bookingHistory.totalCount,
        totalPages: state.bookingHistory.totalPages,
        currentPage: state.bookingHistory.currentPage,
        limit: state.bookingHistory.limit,
        isLoadingExcel: state.bookingHistory.isLoadingExcel,
        excel: state.bookingHistory.excel,
        rooms: state.film.rooms,
        allFilms: state.film.allFilms,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        filmAction: bindActionCreators(filmAction, dispatch),
        bookingHistoryAction: bindActionCreators(bookingHistoryAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingHistoryContainer);