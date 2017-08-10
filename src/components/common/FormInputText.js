import React from 'react';
import PropTypes from 'prop-types';

class FormInputText extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className={this.props.isValidate ? "form-group has-error" : "form-group"}>
                <label className="control-label" htmlFor={this.props.name}>{this.props.label}</label>
                <input
                    className="form-control"
                    id={this.props.name}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChange={(event) => {
                        this.setState({isPristine: false});
                        this.props.updateFormData(event);
                    }}
                    disabled={this.props.disabled}
                />
                {this.props.isValidate &&
                <span className="help-block">{this.props.notiValidate}</span>}
            </div>

        );
    }
}

FormInputText.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    updateFormData: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    isValidate: PropTypes.bool,
    notiValidate: PropTypes.string,

};

export default FormInputText;
