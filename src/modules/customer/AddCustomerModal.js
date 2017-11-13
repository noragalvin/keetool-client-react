import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import * as customerActions from './customerActions';
import FormInputText from '../../components/common/FormInputText';
import FormInputSelect from '../../components/common/FormInputSelect';
import FormInputDate from '../../components/common/FormInputDate';
import * as helper from '../../helpers/helper';
import {GENDER} from '../../constants/constants';



class AddCustomerModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    }


    componentDidUpdate() {
        this.initForm();
    }
    initForm() {
        helper.setFormValidation('#form-add-staff');
    }

    render() {
        let {name, email, address, phone, dob , gender} = this.props.customer;

        return (
            <div>


                <div className="card">
                    <form id="form-add-staff" onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                        <div className="card-header card-header-icon" data-background-color="rose">
                            <i className="material-icons">contacts</i>
                        </div>
                        <div className="card-content">
                            <h4 className="card-title">
                                Thêm nhân viên
                            </h4>

                            <FormInputText
                                label="Họ và tên"
                                name="name"
                                updateFormData={this.props.updateFormData}
                                required={true}
                                type="text"
                                value={name}
                            />
                            <FormInputText
                                label="Địa chỉ email"
                                name="email"
                                updateFormData={this.props.updateFormData}
                                required={true}
                                type="email"
                                value={email}
                            />

                            <FormInputText
                                label="Địa chỉ"
                                name="address"
                                updateFormData={this.props.updateFormData}
                                type="text"
                                value={address}
                                required={true}
                            />
                            <FormInputText
                                label="Số điện thoại"
                                name="phone"
                                updateFormData={this.props.updateFormData}
                                type="tel"
                                value={phone}
                                required={true}
                            />
                            <FormInputSelect
                                label="Giới tính"
                                updateFormData={this.props.updateFormData}
                                name="gender"
                                data = {GENDER}
                                value={gender}
                                required={true}
                            />

                            <FormInputDate
                                label="Sinh nhật"
                                name="dob"
                                updateFormData={this.props.updateFormData}
                                id="form-date-of-birth"
                                value={dob}
                                required={true}
                            />

                        </div>
                    </form>
                </div>

            </div>
        );
    }
}

AddCustomerModal.propTypes = {
    isShowModal: PropTypes.bool,
    updateFormData : PropTypes.func,
    customer : PropTypes.object,
};


function mapStateToProps(state) {
    return {
        isShowModal: state.wareHouses.modal.isShowModal,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        customerActions: bindActionCreators(customerActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomerModal);