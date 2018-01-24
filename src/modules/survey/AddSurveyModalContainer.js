import React from 'react';
import PropTypes from 'prop-types';
import {Button, ControlLabel, FormControl, FormGroup, Modal} from "react-bootstrap";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {saveSurvey, toggleEditSurveyModal, updateSurveyFormData} from "./surveyActions";

class AddSurveyModalContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            surveyName: '',
            isLoading: false,
        };

        this.handleClose = this.handleClose.bind(this);
        this.inputOnchange = this.inputOnchange.bind(this);
        this.submitButtonOnClick = this.submitButtonOnClick.bind(this);
        this.setState({
            isCreate: true
        });
    }

    handleClose() {
        this.props.surveyActions.toggleEditSurveyModal(false);
    }

    submitButtonOnClick() {
        const file = this.refs.file.files[0];
        if (this.isCreate) {
            this.props.surveyActions.saveSurvey(this.props.survey, file);
        } else {
            this.props.surveyActions.saveSurvey(this.props.survey, file);
        }

    }

    inputOnchange(event) {
        const survey = {...this.props.survey};
        const field = event.target.name;
        survey[field] = event.target.value;
        this.props.surveyActions.updateSurveyFormData(survey);
    }

    render() {
        const {survey} = this.props;

        return (
            <Modal show={this.props.showEditSurveyModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm khảo sát</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="fileinput fileinput-new text-center" data-provides="fileinput">
                        <div className="fileinput-new thumbnail">
                            <img src="http://d1j8r0kxyu9tj8.cloudfront.net/images/1516675031ayKt10MXsow6QAh.jpg"/>
                        </div>
                        <div className="fileinput-preview fileinput-exists thumbnail"/>
                        <div>
                            <span className="btn btn-rose btn-round btn-file">
                                <span className="fileinput-new">Ảnh đại diện</span>
                                <span className="fileinput-exists">Change</span>
                                <input type="file"
                                       ref="file"
                                       name="image_url"/>
                                <div className="ripple-container"/>
                            </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Tên:</label>
                        <input type="text"
                               name="name"
                               value={survey.name || ""}
                               className="form-control"
                               placeholder="Tên khảo sát"
                               onChange={this.inputOnchange}/>
                    </div>

                    <FormGroup
                        controlId="target">
                        <ControlLabel>Chỉ tiêu</ControlLabel>
                        <FormControl
                            type="number"
                            name="target"
                            value={survey.target || ""}
                            placeholder="Chỉ tiêu"
                            onChange={this.inputOnchange}
                        />
                    </FormGroup>

                    <FormGroup controlId="description">
                        <ControlLabel>Mô tả</ControlLabel>
                        <FormControl
                            name="description"
                            value={survey.description || ""}
                            onChange={this.inputOnchange}
                            componentClass="textarea" placeholder="Mô tả"/>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    {
                        this.state.isLoading ?
                            (
                                <button
                                    className="btn btn-fill btn-rose disabled">
                                    <i className="fa fa-spinner fa-spin"/> Đang cập nhật
                                </button>
                            ) :
                            (
                                <div>
                                    <button
                                        // disabled={this.state.surveyName === ""}
                                        className="btn btn-rose" onClick={this.submitButtonOnClick}>Tạo
                                    </button>
                                    <Button className="btn btn-default" onClick={this.handleClose}>Đóng</Button>
                                </div>
                            )
                    }
                </Modal.Footer>
            </Modal>
        );
    }
}

AddSurveyModalContainer.propTypes = {
    showEditSurveyModal: PropTypes.bool.isRequired,
    surveyActions: PropTypes.object.isRequired,
    survey: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        showEditSurveyModal: state.survey.showEditSurveyModal,
        survey: state.survey.survey,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        surveyActions: bindActionCreators({
            saveSurvey,
            toggleEditSurveyModal,
            updateSurveyFormData
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSurveyModalContainer);