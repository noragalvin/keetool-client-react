/**
 * Created by Nangbandem.
 */
import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import ReactEditor from '../../../components/common/ReactEditor';
import  * as coursesCreateEditActions from './CoursesCreateEditActions';
import initialState from '../../../reducers/initialState';
import FormInputText from '../../../components/common/FormInputText';
import {NO_IMAGE} from '../../../constants/env';
import TabCourse from "../TabCourse";
import Loading from "../../../components/common/Loading";
import * as helper from '../../../helpers/helper'

class CreateEditCoursesContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        console.log('edit con',this.props);
        this.state = {
            id: '',
            name: '',
            duration: '',
            price: '',
            description: '',
            linkmac: "",
            linkwindow: "",
            num_classes: '',
            mac_how_install: '',
            window_how_install: "",
            cover_url: '',
            color: "",
            image_url: '',
            icon_url: '',
            created_at: "",
            detail: "",
            lessons: [],
            links: []
        }
        this.updateFormData = this.updateFormData.bind(this);
    }


    componentWillMount() {
        console.log('course form container ',this.props);
        this.props.coursesCreateEditActions.loadCourses(this.props.params.courseId);

    }

    componentWillReceiveProps(nextProps){
        console.log('recieve props',nextProps);
        this.setState(nextProps.data.data.course);
    }

    updateCourseDetail(detail){
        this.setState({detail:detail});
    }

    updateFormData(e){
        const feild = e.target.name;
        const value = e.target.value;
        console.log(feild);
        console.log(value);
        let data = this.state;
        data[feild] = value;
        this.setState(data);
        console.log('state',this.state);
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
                                                     urlPost={""}
                                                     fileField="image"
                                                     name="detail"
                                                     updateEditor={()=>{}}

                                                     value={this.state.detail}
                                                 />
                                             }
                                             <p>{this.state.detail}</p>
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
                                        { NO_IMAGE=='' ?
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
                                                           onChange={this.props.handleFileUploadAvatar}
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
};

function mapStateToProps(state) {
    return {
        isLoading: state.coursesCreateEdit.isLoading,
        data: state.coursesCreateEdit.data
    };
}

function mapDispatchToProps(dispatch) {
    return {
        coursesCreateEditActions: bindActionCreators(coursesCreateEditActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEditCoursesContainer);
