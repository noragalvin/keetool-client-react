import React from 'react';
import FormInputText from '../../components/common/FormInputText';
import Loading from '../../components/common/Loading';
import PropTypes from 'prop-types';
import * as helper from '../../helpers/helper';
import { NO_AVATAR } from '../../constants/env';
import TooltipButton from '../../components/common/TooltipButton';

class AddStaffComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    checkValidate() {
        if ($('#form-add-staff').valid()) {
            this.props.addStaff();
        }
    }

    render() {
        let { name, email, role_id, color, base_id, department_id } = this.props.staffForm;
        let roleSelect = this.props.roles.filter(function (roleData) {
            return role_id == roleData.id;
        })[0];
        if (roleSelect === undefined || roleSelect === null) {
            roleSelect = {};
        }
        let avatar = helper.avatarEmpty(this.props.staffForm.avatar_url) ?
            NO_AVATAR : this.props.staffForm.avatar_url;
        return (
            <div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            {(this.props.isLoadingStaff) ? <Loading /> :
                                <form id="form-add-staff" onSubmit={(e) => {
                                    e.preventDefault();
                                }}>

                                    <div className="card-content">
                                        <h4 className="card-title">
                                            <strong>
                                                Thông tin nhân viên
                                            </strong>
                                        </h4>
                                        <FormInputText
                                            label="Email"
                                            name="email"
                                            //updateFormData={this.props.updateFormData}
                                            value={email}
                                            //required={true}
                                            type="email"
                                            disabled
                                        />
                                        <div className="form-group">
                                            <label>Cơ sở</label>
                                            <select className="form-control"
                                                value={base_id}
                                                onChange={this.props.updateFormData}
                                                name="base_id"
                                                disabled
                                            >
                                                {this.props.bases !== null && this.props.bases !== undefined &&
                                                    this.props.bases.map((base, key) => {
                                                        return (
                                                            <option
                                                                key={key}
                                                                value={base.id}
                                                            >

                                                                {!helper.isEmptyInput(base.name) && `${base.name}: ${base.address}`}
                                                            </option>);
                                                    })}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Chức vụ trong công ty</label>
                                            <select
                                                className="form-control"
                                                value={role_id}
                                                onChange={this.props.updateFormData}
                                                name="role_id"
                                                disabled
                                            >
                                                {this.props.roles !== null && this.props.roles !== undefined &&
                                                    this.props.roles.map((item, key) => {
                                                        return (
                                                            <option
                                                                key={key}
                                                                value={item.id}
                                                            >
                                                                {item.role_title}
                                                            </option>);
                                                    })}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Bộ phận</label>
                                            <select
                                                className="form-control"
                                                value={department_id}
                                                onChange={this.props.updateFormData}
                                                name="department_id"
                                                disabled
                                            >
                                                {this.props.departments !== null && this.props.departments !== undefined &&
                                                    this.props.departments.map((item, key) => {
                                                        return (
                                                            <option
                                                                key={key}
                                                                value={item.id}
                                                            >
                                                                {item.name}
                                                            </option>);
                                                    })}
                                            </select>
                                        </div>
                                        {
                                            this.props.roles && (this.props.role == 2) ?

                                                <div>
                                                    <FormInputText
                                                        label="Lương cơ bản"
                                                        name="salary"
                                                        value={0}
                                                        //required={true}
                                                        type="text"
                                                        //updateFormData={this.props.updateFormData}
                                                        disabled
                                                    />
                                                    < FormInputText
                                                        label="Lương doanh thu"
                                                        name="salary_revenue"
                                                        value={0}
                                                        //required={true}
                                                        type="text"
                                                        //updateFormData={this.props.updateFormData}
                                                        disabled
                                                    />
                                                    <FormInputText
                                                        label="Lương phụ cấp"
                                                        name="salary_allowance"
                                                        value={0}
                                                        //required={true}
                                                        type="text"
                                                        //updateFormData={this.props.updateFormData}
                                                        disabled
                                                    />
                                                </div>
                                                :
                                                <div />
                                        }
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card card-profile">
                                    <div className="card-avatar">
                                        <a className="content-avatar">
                                            <div className="img"
                                                style={{
                                                    background: 'url(' + avatar + ') center center / cover',
                                                    width: '130px',
                                                    height: '130px'
                                                }}
                                            />
                                        </a>
                                    </div>
                                    <div className="card-content">
                                        <h6 className="category text-gray">
                                            {helper.isEmptyInput(roleSelect.role_title) ? 'Đây là chức vụ' : roleSelect.role_title}
                                        </h6>
                                        <h4 className="card-title">
                                            {helper.isEmptyInput(name) ? 'Đây là tên' : name}</h4>
                                        <p className="description" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-content">
                                        <h4 className="card-title"><strong>Màu</strong></h4>

                                        <TooltipButton text="Màu"
                                            placement="top"
                                        >
                                            <button className="btn btn-sm"
                                                style={{
                                                    backgroundColor: '#' + color,
                                                    inlineSize: "-webkit-fill-available",
                                                    height: "20px"
                                                }}>
                                                <div className="ripple-container" />
                                            </button>
                                        </TooltipButton>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AddStaffComponent.propTypes = {
    staffForm: PropTypes.object.isRequired,
    updateFormData: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired,
    addStaff: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
    isLoadingAddStaff: PropTypes.bool.isRequired,
    isChangingAvatar: PropTypes.bool.isRequired,
    isLoadingStaff: PropTypes.bool.isRequired,
    isLoadingRoles: PropTypes.bool.isRequired,
    isResettingPassword: PropTypes.bool.isRequired,
    roles: PropTypes.array.isRequired,
    bases: PropTypes.array.isRequired,
    departments: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    role: PropTypes.number,
};

export default AddStaffComponent;
