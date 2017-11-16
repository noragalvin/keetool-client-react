import React from 'react';
import PropTypes from 'prop-types';


class ListChildSupplier extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12">
                        <table id="property-table" className="table dataTable" role="grid"
                               aria-describedby="property-table_info">
                            <thead>
                            <tr className="text-rose" role="row">
                                <th>Tên nhà cung cấp</th>
                                <th>Số điện thoại</th>
                                <th>Email</th>
                                <th/>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.suppliersList && this.props.suppliersList.map(
                                (supplier => {
                                    return (
                                        <tr role="row" className="even" key={supplier.id}>
                                            <td className="sorting_1">{supplier.name}</td>
                                            <td>{supplier.phone}</td>
                                            <td>{supplier.email}</td>
                                            <td>
                                                <div className="btn-group-action">
                                                    <div style={{display: 'inline-block'}}>
                                                        <a data-toggle="tooltip" title type="button"
                                                           rel="tooltip"
                                                           data-original-title="Sửa">
                                                            <i className="material-icons">edit</i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

ListChildSupplier.propTypes = {
    suppliersList: PropTypes.array,
    deleteSupplier : PropTypes.func,
};


export default ListChildSupplier;