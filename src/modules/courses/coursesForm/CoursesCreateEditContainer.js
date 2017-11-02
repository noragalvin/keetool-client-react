/**
 * Created by Nangbandem.
 */
import React                            from 'react';
import {connect}                        from 'react-redux';
import PropTypes                        from 'prop-types';
import {bindActionCreators}             from 'redux';
import ReactEditor                      from '../../../components/common/ReactEditor';
import  * as coursesCreateEditActions   from './CoursesCreateEditActions';
import FormInputText                    from '../../../components/common/FormInputText';
import {NO_IMAGE}                       from '../../../constants/env';
import TabCourse                        from "../TabCourse";
import Loading                          from "../../../components/common/Loading";
import * as helper                      from '../../../helpers/helper';
import {linkUploadImageEditor}          from '../../../constants/constants';
import {CirclePicker}                   from 'react-color';
import {Link}                           from 'react-router';


class CreateEditCoursesContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            id                  : null,
            name                : '',
            duration            : '',
            price               : '',
            description         : '',
            linkmac             : "",
            linkwindow          : "",
            num_classes         : '',
            mac_how_install     : '',
            window_how_install  : "",
            cover_url           : '',
            color               : "",
            image_url           : '',
            icon_url            : '',
            created_at          : "",
            detail              : "",
            lessons             : [],
            links               : []
        }
        this.updateFormData     = this.updateFormData.bind(this);
        this.uploadAvatar       = this.uploadAvatar.bind(this);
        this.uploadLogo         = this.uploadLogo.bind(this);
        this.uploadCover        = this.uploadCover.bind(this);
        this.changeColor        = this.changeColor.bind(this);
        this.commitCourseData   = this.commitCourseData.bind(this);
        this.updateEditor       = this.updateEditor.bind(this);
    }


    componentWillMount() {
        //console.log('course form container ',this.props);
        let id = this.props.params.courseId;
        this.props.coursesCreateEditActions.loadCourses(id);

    }

    componentWillReceiveProps(nextProps){
        //console.log('recieve props',nextProps);
        this.setState(nextProps.data);
    }

    updateCourseDetail(detail){
        this.setState({detail:detail});
    }

    updateFormData(e){
        const   feild   = e.target.name;
        const   value   = e.target.value;
        let     data    = this.state;
        data[feild]     = value;

        this.setState(data);
    }

    updateEditor(content){
        let data        = this.state;
        data.detail     = content;
        this.setState(data);
    }

    uploadAvatar(event){
        let file = event.target.files[0];
        this.props.coursesCreateEditActions.uploadAvatar(file, this.state);
    }
    uploadLogo(event){
        let file = event.target.files[0];
        this.props.coursesCreateEditActions.uploadLogo(file, this.state);
    }
    uploadCover(event){
        let file = event.target.files[0];
        this.props.coursesCreateEditActions.uploadCover(file, this.state);
    }

    changeColor(color){
        let data    = this.state;
        data.color  = color.hex;
        this.setState(data);
    }

    commitCourseData(){
        this.props.coursesCreateEditActions.commitCourseData(this.state);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                        <div className="row">
                             <div className="col-md-8">
                                <div className="card">

                                        <TabCourse url="/manage/courses/create/general"/>

                                    <div className="card-content">
                                        <h4 className="card-title">Tạo Môn Học</h4>
                                        {this.props.isLoading ? <Loading/> :
                                            <form role="form"
                                                  id="form-course-form">
                                                <div className="row">

                                                    <div className="col-md-12">
                                                        <FormInputText
                                                            label="Tên môn học"
                                                            required
                                                            name="name"
                                                            updateFormData={this.updateFormData}
                                                            value={this.state.name}
                                                        /></div>

                                                    <div className="col-md-6">
                                                        <FormInputText
                                                        label="Thời lượng"
                                                        required
                                                        name="duration"
                                                        updateFormData={this.updateFormData}
                                                        value={this.state.duration}
                                                        /></div>
                                                    <div className="col-md-6">
                                                        <FormInputText
                                                            label="Giá"
                                                            required
                                                            name="price"
                                                            updateFormData={this.updateFormData}
                                                            value={this.state.price}
                                                        />
                                                    </div>

                                                    <div className="col-md-12">
                                                        <FormInputText
                                                            label="Mô tả ngắn"
                                                            required
                                                            name="description"
                                                            updateFormData={this.updateFormData}
                                                            value={this.state.description}
                                                        /></div>
                                                    <div className="col-md-6">
                                                        <FormInputText
                                                        label="Link tải phần mềm trên Windows"
                                                        required
                                                        name="linkwindow"
                                                        updateFormData={this.updateFormData}
                                                        value={this.state.linkwindow}
                                                        /></div>
                                                    <div className="col-md-6">
                                                        <FormInputText
                                                            label="Link hướng dẫn trên Windows"
                                                            required
                                                            name="window_how_install"
                                                            updateFormData={this.updateFormData}
                                                            value={this.state.window_how_install}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <FormInputText
                                                        label="Link tải phần mềm trên Mac"
                                                        required
                                                        name="linkmac"
                                                        updateFormData={this.updateFormData}
                                                        value={this.state.linkmac}
                                                        /></div>
                                                    <div className="col-md-6">
                                                        <FormInputText
                                                            label="Link hướng dẫn trên Mac"
                                                            required
                                                            name="mac_how_install"
                                                            updateFormData={this.updateFormData}
                                                            value={this.state.mac_how_install}
                                                        />
                                                    </div>

                                                </div>
                                                {this.props.isCommitting ?
                                                    <button className="btn btn-rose btn-round disabled" type="button">
                                                        <i className="fa fa-spinner fa-spin"/> Đang tải lên
                                                    </button>
                                                    :
                                                    <Link to="/manage/courses" >
                                                    <button
                                                        className="btn btn-fill btn-rose"
                                                        type="button"
                                                        onClick={this.commitCourseData}
                                                    > Lưu </button></Link>
                                                }
                                            </form>
                                        }
                                    </div>

                                </div>

                                 <div className="col-md-12">
                                     <div className="card">
                                         <div className="card-header card-header-icon" data-background-color="rose"><i
                                             className="material-icons">bookmark</i></div>
                                         <div className="card-content">
                                             <h4 className="card-title">Chi tiết khoá học</h4>
                                             {this.props.isLoading ? <Loading/> :
                                                 <ReactEditor
                                                     urlPost={linkUploadImageEditor()}
                                                     fileField="image"
                                                     name="detail"
                                                     updateEditor={this.updateEditor}

                                                     value={this.state.detail ? this.state.detail : ""}
                                                 />
                                             }

                                         </div>

                                     </div>
                                 </div>
                             </div>

                            <div className="col-md-4">
                                <div className="card">
                                    <div className="card-header card-header-icon" data-background-color="rose">
                                        <i className="material-icons">announcement</i>
                                    </div>
                                    <div className="card-content"><h4 className="card-title">Thông tin về form </h4>


                                        <img src = {helper.isEmptyInput(this.state.icon_url) ? NO_IMAGE : this.state.icon_url} />
                                        { this.props.isUpdatingLogo ?
                                            (
                                                <button className="btn btn-rose btn-round disabled" type="button">
                                                    <i className="fa fa-spinner fa-spin"/> Đang tải lên
                                                </button>
                                            )
                                            :
                                            (
                                                <button className="btn btn-fill btn-rose" type="button">
                                                    Chọn ảnh icon
                                                    <input type="file"
                                                           accept=".jpg,.png,.gif"
                                                           onChange={this.uploadLogo}
                                                           style={{
                                                               cursor: 'pointer',
                                                               opacity: "0.0",
                                                               position: "absolute",
                                                               top: 0,
                                                               left: 0,
                                                               bottom: 0,
                                                               right: 0,
                                                               width: "100%",
                                                               height: "100%"
                                                           }}
                                                    />
                                                </button>
                                            )
                                        }
                                        <img src = {helper.isEmptyInput(this.state.image_url) ? NO_IMAGE : this.state.image_url} />
                                        { this.props.isUpdatingAvatar ?
                                            (
                                                <button className="btn btn-rose btn-round disabled" type="button">
                                                    <i className="fa fa-spinner fa-spin"/> Đang tải lên
                                                </button>
                                            )
                                            :
                                            (
                                                <button className="btn btn-fill btn-rose" type="button">
                                                    Chọn ảnh đại diện
                                                    <input type="file"
                                                           accept=".jpg,.png,.gif"
                                                           onChange={this.uploadAvatar}
                                                           style={{
                                                               cursor: 'pointer',
                                                               opacity: "0.0",
                                                               position: "absolute",
                                                               top: 0,
                                                               left: 0,
                                                               bottom: 0,
                                                               right: 0,
                                                               width: "100%",
                                                               height: "100%"
                                                           }}
                                                    />
                                                </button>
                                            )
                                        }
                                        <img src = {helper.isEmptyInput(this.state.cover_url) ? NO_IMAGE : this.state.cover_url} />
                                        { this.props.isUpdatingCover ?
                                            (
                                                <button className="btn btn-rose btn-round disabled" type="button">
                                                    <i className="fa fa-spinner fa-spin"/> Đang tải lên
                                                </button>
                                            )
                                            :
                                            (
                                                <button className="btn btn-fill btn-rose" type="button">
                                                    Chọn cover
                                                    <input type="file"
                                                           accept=".jpg,.png,.gif"
                                                           onChange={this.uploadCover}
                                                           style={{
                                                               cursor: 'pointer',
                                                               opacity: "0.0",
                                                               position: "absolute",
                                                               top: 0,
                                                               left: 0,
                                                               bottom: 0,
                                                               right: 0,
                                                               width: "100%",
                                                               height: "100%"
                                                           }}
                                                    />
                                                </button>
                                            )
                                        }

                                        <div className="card-content">
                                            <h4 className="card-title">Chọn màu</h4>
                                            <CirclePicker width="100%"
                                                          color={this.state.color}
                                                          onChangeComplete={this.changeColor}
                                            />
                                        </div>

                                        <Link to="/manage/courses">
                                        <button
                                            className="btn btn-fill btn-rose"
                                            type="button"
                                            onClick={this.commitCourseData}
                                        > Lưu </button></Link>


                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        );
    }
}

CreateEditCoursesContainer.propTypes = {
    isLoading           : PropTypes.bool,
    data                : PropTypes.object,
    isUpdatingAvatar    : PropTypes.bool,
    updateAvatarError   : PropTypes.bool,
    isUpdatingLogo      : PropTypes.bool,
    updateLogoError     : PropTypes.bool,
    isUpdatingCover     : PropTypes.bool,
    updateCoverError    : PropTypes.bool,
    isCommitting        : PropTypes.bool
};

function mapStateToProps(state) {
    return {
        isLoading           : state.coursesCreateEdit.isLoading,
        data                : state.coursesCreateEdit.data,
        isUpdatingAvatar    : state.coursesCreateEdit.isUpdatingAvatar,
        updateAvatarError   : state.coursesCreateEdit.updateAvatarError,
        isUpdatingLogo      : state.coursesCreateEdit.isUpdatingLogo,
        updateLogoError     : state.coursesCreateEdit.updateLogoError,
        isUpdatingCover     : state.coursesCreateEdit.isUpdatingCover,
        updateCoverError    : state.coursesCreateEdit.updateCoverError,
        isCommitting        : state.coursesCreateEdit.isCommitting
    };
}

function mapDispatchToProps(dispatch) {
    return {
        coursesCreateEditActions: bindActionCreators(coursesCreateEditActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEditCoursesContainer);
