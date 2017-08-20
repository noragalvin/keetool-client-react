import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as staffActions from '../../actions/staffActions';
import * as roleActions from '../../actions/roleActions';
import * as baseActions from '../../actions/baseActions';
import ManageStaffsComponent from "../../components/manageStaff/ManageStaffsComponent";
import * as helper from '../../helpers/helper';

// Import actions here!!

class ManageStaffsContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.changeRoleStaff = this.changeRoleStaff.bind(this);
        this.changeBaseStaff = this.changeBaseStaff.bind(this);
        this.deleteStaff = this.deleteStaff.bind(this);
        this.staffsSearchChange = this.staffsSearchChange.bind(this);
        this.loadStaffs = this.loadStaffs.bind(this);
        this.state = {
            page: 1,
            query: ""
        };
        this.timeOut = null;
    }

    componentWillMount() {
        this.loadStaffs();
        this.props.roleActions.loadRolesData();
        if (!this.props.baseListData || this.props.baseListData.length <= 0) {
            this.props.baseActions.loadDataBase();
        }
    }

    changeRoleStaff(staffId, roleId) {
        this.props.staffActions.changeRoleStaff(staffId, roleId);
    }

    changeBaseStaff(staffId, baseId) {
        this.props.staffActions.changeBaseStaff(staffId, baseId);
    }

    deleteStaff(staff) {
        helper.confirm("error", "Xoá", "Bạn có chắc chắn muốn xóa nhân viên này",
            function () {
                this.props.staffActions.deleteStaffData(staff);
            }.bind(this));

    }


    staffsSearchChange(value) {
        this.setState({
            page: 1,
            query: value
        });
        if (this.timeOut !== null) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(function () {
            this.props.staffActions.loadStaffsData(this.state.page, this.state.query);
        }.bind(this), 500);
    }

    loadStaffs(page = 1) {
        this.setState({page});
        this.props.staffActions.loadStaffsData(page, this.state.query);
    }

    render() {
        let roleListData = (this.props.roleListData !== undefined) ? this.props.roleListData : [];
        let baseListData = (this.props.baseListData !== undefined) ? this.props.baseListData : [];
        return (
            <ManageStaffsComponent
                {...this.props}
                changeRoleStaff={this.changeRoleStaff}
                changeBaseStaff={this.changeBaseStaff}
                staffsSearchChange={this.staffsSearchChange}
                loadStaffs={this.loadStaffs}
                deleteStaff={this.deleteStaff}
                roleListData={[{id: 0, role_title: ''}, ...roleListData]}
                baseListData={[{id: 0, name: '', address: ''}, ...baseListData]}
                search={this.state.query}
            />
        );

    }
}

ManageStaffsContainer.propTypes = {
    staffActions: PropTypes.object.isRequired,
    roleActions: PropTypes.object.isRequired,
    baseActions: PropTypes.object.isRequired,
    isLoadingStaffs: PropTypes.bool.isRequired,
    isLoadingRoles: PropTypes.bool.isRequired,
    isLoadingBases: PropTypes.bool.isRequired,
    errorStaffs: PropTypes.bool.isRequired,
    errorBases: PropTypes.bool.isRequired,
    errorRoles: PropTypes.bool.isRequired,
    staffListData: PropTypes.array.isRequired,
    roleListData: PropTypes.array.isRequired,
    baseListData: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
};

ManageStaffsContainer.contextTypes = {
    router: PropTypes.object
};

function mapStateToProps(state) {
    return {
        isLoadingStaffs: state.staffs.isLoading,
        staffListData: state.staffs.staffListData,
        currentPage: state.staffs.currentPage,
        totalPages: state.staffs.totalPages,
        errorStaffs: state.staffs.error,
        isLoadingRoles: state.roles.isLoading,
        roleListData: state.roles.roleListData,
        errorRoles: state.roles.error,
        isLoadingBases: state.bases.isLoading,
        baseListData: state.bases.baseData,
        errorBases: state.bases.error,

    };
}

function mapDispatchToProps(dispatch) {
    return {
        staffActions: bindActionCreators(staffActions, dispatch),
        roleActions: bindActionCreators(roleActions, dispatch),
        baseActions: bindActionCreators(baseActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageStaffsContainer);
