import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import RenderField, { ReduxFormSelect } from './../../HelperComponents/RenderField/RenderField';
import './CustumerInnerForm.scss';
import { getSalesList } from '../../../actions/ordersActions';
import { editCustomer, editCustomerPartial, getRegions } from '../../../actions/managersActions';
import { useSelector, useDispatch } from 'react-redux';
import SelectComponent from './../../HelperComponents/SelectComponent/SelectComponent';

import { withRouter } from 'react-router-dom';

function CustumerInnerForm({ id, handleSubmit, resetForm, history = '/main/customers/inner/' }) {
  const dispatch = useDispatch();
  const { sales } = useSelector(({ orders }) => orders);
  const { regionsList } = useSelector(({ managers }) => managers);
  const { info } = useSelector(({ customers }) => customers);
  const {
    info: {
      email,
      phone,
      customer_name,
      clinic_name,
      clinic_email,
      director,
      province,
      district,
      region,
      sales_rep,
      tin,
    },
  } = useSelector(({ customers }) => customers);

  const listActions = () => {
    dispatch(getRegions());
    dispatch(getSalesList());
    dispatch(getRegions());
  };

  useEffect(() => {
    listActions();
  }, []);

  return (
    <>
      <form
        className="custumer-edit-form"
        onSubmit={handleSubmit(() =>
          dispatch(
            editCustomer(id, {
              ...info,
              clinic_email: email,
              tin: tin,
              username: director,
              clinic_name: customer_name,
              sales_rep: sales_rep && sales_rep.id ? sales_rep.id : null,
              region: region && region.id ? region.id : null,
            }),
          ).then((res) => res.payload.status === 201 && history.push('/main/customers')),
        )}>
        <p className="custumer-edit-title">general info</p>

        <div className="custumer-edit-container">
          <div className="block_edit_add_field doted">
            <div className="full-width clinic-name">
              <span>Clinic name*</span>
              <input
                name={`customer_name`}
                type="text"
                placeholder="Type here..."
                value={customer_name}
                onChange={(e) =>
                  dispatch(
                    editCustomerPartial({
                      ...info,
                      customer_name: e.target.value,
                    }),
                  )
                }
              />
            </div>
            <div className="full-width tin">
              <span>TIN*</span>
              <input
                name={`tin`}
                type="text"
                placeholder="Type here..."
                value={tin}
                onChange={(e) =>
                  dispatch(
                    editCustomerPartial({
                      ...info,
                      tin: e.target.value,
                    }),
                  )
                }
              />
            </div>
            <div className="full-width region">
              <span>Region</span>
              <FormControl className="select_wrapper">
                <SelectComponent
                  name={`region`}
                  value={{
                    label: region && region.name !== undefined && region.name,
                    value: region && region.id !== undefined && region.id,
                  }}
                  placeholder="Select…"
                  className="wide-field"
                  options={
                    regionsList &&
                    [
                      {
                        label: 'None',
                        id: null,
                      },
                      ...regionsList,
                    ].map((el) => ({
                      label: el.label,
                      value: el.value,
                      id: el.id,
                    }))
                  }
                  change={(e) =>
                    dispatch(
                      editCustomerPartial({
                        ...info,
                        region: { id: e.value, name: e.label },
                      }),
                    )
                  }
                  component={ReduxFormSelect}
                  isClearable={false}
                  isSearchable={true}
                />
              </FormControl>
            </div>
            <div className="full-width province">
              <span>Province*</span>
              <input
                type="text"
                placeholder="Type here..."
                value={province}
                onChange={(e) =>
                  dispatch(editCustomerPartial({ ...info, province: e.target.value }))
                }
              />
            </div>
            <div className="full-width district">
              <span>District</span>
              <input
                type="text"
                placeholder="Type here..."
                value={district}
                onChange={(e) =>
                  dispatch(editCustomerPartial({ ...info, district: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="block_edit_add_field doted">
            <div className="full-width email">
              <span>Email*</span>
              <input
                type="text"
                placeholder="Type here..."
                value={email !== undefined && email}
                onChange={(e) => dispatch(editCustomerPartial({ ...info, email: e.target.value }))}
              />
            </div>
            <div className="full-width phone">
              <span>Phone</span>
              <input
                type="text"
                placeholder="Type here..."
                value={phone}
                onChange={(e) => dispatch(editCustomerPartial({ ...info, phone: e.target.value }))}
              />
            </div>
            <div className="full-width director">
              <span>Director*</span>
              <input
                type="text"
                placeholder="Type here..."
                value={director}
                onChange={(e) =>
                  dispatch(editCustomerPartial({ ...info, director: e.target.value }))
                }
              />
            </div>
            <div className="full-width sales">
              <span>Sales Rep.</span>
              <FormControl className="select_wrapper">
                <SelectComponent
                  name={`sales`}
                  value={{
                    label: sales_rep && sales_rep.username !== undefined && sales_rep.username,
                    value: sales_rep && sales_rep.id !== undefined && sales_rep.id,
                  }}
                  placeholder="Select…"
                  className="wide-field"
                  options={
                    sales &&
                    [
                      {
                        username: 'None',
                        id: null,
                      },
                      ...sales,
                    ].map((el) => ({
                      label: el.username,
                      value: el.id,
                      id: el.id,
                    }))
                  }
                  component={ReduxFormSelect}
                  change={(e) =>
                    dispatch(
                      editCustomerPartial({
                        ...info,
                        sales_rep: { id: e.value, username: e.label },
                      }),
                    )
                  }
                  isClearable={false}
                  isSearchable={true}
                />
              </FormControl>
            </div>
          </div>

          <div className="wrapper_btn">
            <div>
              <button
                disabled={
                  customer_name === '' ||
                  province === null ||
                  province === '' ||
                  district === '' ||
                  district === null ||
                  email === '' ||
                  director === '' ||
                  director === null ||
                  tin === '' ||
                  tin === null
                }
                className={
                  customer_name === '' ||
                  province === '' ||
                  province === null ||
                  district === '' ||
                  district === null ||
                  email === '' ||
                  director === '' ||
                  director === null ||
                  tin === '' ||
                  tin === null
                    ? 'blue_btn_unactive'
                    : 'blue_btn_bg'
                }
                formAction>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
const validate = (values) => {
  const errors = {};
  if (!values.customer_name) {
    errors.customer_name = 'Required field';
  }
  if (!values.user) {
    errors.user = 'Required field';
  }
  if (!values.payment_status) {
    errors.payment_status = 'Required field';
  }

  return errors;
};
const CustumersInnerForm = reduxForm({
  form: 'CustumersInnerForm',
  validate,
  enableReinitialize: true,
})(CustumerInnerForm);

const selector = formValueSelector('CustumerInnerForm');
export default withRouter(CustumersInnerForm);
