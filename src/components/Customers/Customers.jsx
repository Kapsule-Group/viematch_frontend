import React, { Component, Fragment } from 'react';
import { reduxForm, Field, FieldArray, formValueSelector, change } from 'redux-form';
import RenderField, { ReduxFormSelect } from './../HelperComponents/RenderField/RenderField';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Pagination from '../HelperComponents/Pagination/Pagination';
import ExpansionPanel from '../HelperComponents/ExpansionPanel/ExpansionPanel';
import DialogComponent from '../HelperComponents/DialogComponent/DialogComponent';

import Loader from '../HelperComponents/ContentLoader/ContentLoader';
import './Customers.scss';
import { getSalesList } from '../../actions/ordersActions';
import { getCustomers, approveAct, addInfo } from '../../actions/customersActions';
//import {postLogin} from "../../actions/authActions";
import { createCustomer, getRegions, editCustomer } from '../../actions/managersActions';
import { toastErrors } from '../../helpers/functions';
import FormControl from '@material-ui/core/FormControl';
import SelectComponent from '../HelperComponents/SelectComponent/SelectComponent';
import { toast } from 'react-toastify';

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: '0',
      activePage: 1,
      loading: true,
      needApprovalCustomers: [],
      salesList: props.salesList,
      openCreateDialog: false,
      openEditCustumerDialog: false,
      clinicName: '',
      director: '',
      phone: '',
      email: '',
      password: '',
      openAddDialog: false,
      region_list: [
        { label: 'Rwanda-Kigali', value: 'Rwanda-Kigali' },
        { label: 'Burundi', value: 'Burundi' },
        { label: 'Kenya', value: 'Kenya' },
        { label: 'Rwanda-Gisenyi', value: 'Rwanda-Gisenyi' },
      ],
      addName: '',
      addEmail: '',
      addDirector: '',
      addPhone: '',
      addProvince: '',
      addDistrict: '',
      addRegion: null,
      chosenId: null,
      addPassword: '',
      inputValue: '',
      addClinicName: '',
      addSales: '',
      editPhone: '',
      editEmail: '',
      editSales: '',
      editDirector: '',
      editDistrict: '',
      editProvince: '',
      editRegion: '',
      editClinicName: '',
      tin: '',
    };
  }

  componentDidMount() {
    const {
      data: { role },
      history,
      getSalesList,
      getRegions,
      salesList,
    } = this.props;

    this.getRequest(true, 1);
    getSalesList();
    getRegions();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      data: { role },
      history,
    } = this.props;
    if (prevProps.data.role !== role) {
      if (role === 'sales') {
        history.push('/main/sales-requests');
      }
    }

    prevState.tab !== this.state.tab && this.getRequest(this.state.tab === '0', 1);
  }

  changeTab = (tab) => {
    this.setState({ tab, inputValue: '' });
  };

  changePage = (page) => {
    let newApproval = this.state.tab === '0',
      newPage = page.selected + 1;

    this.getRequest(newApproval, newPage);
  };

  approveFunc = (id, action) => {
    const { approveAct } = this.props;

    approveAct(id, action).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        this.setState({ loading: false });
        this.getRequest(false, 1);
      }
    });
  };

  getRequest = (approval, requestedPageNumber, url) => {
    const { getCustomers } = this.props;
    const { inputValue } = this.state;
    this.setState({
      loading: true,
    });
    let newUrl = url ? url : null,
      newApproval = approval,
      addToState = {};

    getCustomers(false, 1, newUrl).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        addToState.needApprovalCustomers = res.payload.data.results;
      }
    });
    getCustomers(newApproval, requestedPageNumber, newUrl, inputValue).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        addToState.loading = false;
        addToState.customers = res.payload.data;
        addToState.activePage = requestedPageNumber;
        this.setState({
          ...this.state,
          ...addToState,
        });
      }
    });
  };

  liveSearch = (approval, requestedPageNumber, url, search) => {
    const { getCustomers } = this.props;

    let addToState = {};

    getCustomers(approval, requestedPageNumber, null, search).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        addToState.customers = res.payload.data;
        addToState.activePage = requestedPageNumber;
        this.setState({
          ...this.state,
          ...addToState,
        });
      }
    });
  };

  moveToCustomerPage = (id, name) => {
    const { history } = this.props;
    history.push(`/main/customers/inner/${id}`);
  };

  resetAddDialog = () => {
    this.setState({
      clinicName: '',
      director: '',
      phone: '',
      email: '',
      password: '',
      addPassword: '',
      addPhone: '',
      addEmail: '',
      addSales: '',
      addDirector: '',
      addDistrict: '',
      addProvince: '',
      addRegion: '',
      addClinicName: '',
      editPassword: '',
      editPhone: '',
      editEmail: '',
      editSales: '',
      editDirector: '',
      editDistrict: '',
      editProvince: '',
      editRegion: '',
      editClinicName: '',
      openEditCustumerDialog: false,
      openCreateDialog: false,
      tin: '',
    });
  };

  addCustomer = () => {
    const { createCustomer, getManagers, getRegions } = this.props;
    const {
      addPassword,
      addPhone,
      addEmail,
      addSales,
      addDirector,
      addDistrict,
      addProvince,
      addRegion,
      addClinicName,
      activePage,
      tin,
      tab,
    } = this.state;
    createCustomer({
      clinic_email: addEmail,
      clinic_name: addClinicName,
      username: addDirector,
      province: addProvince,
      phone: addPhone,
      password: addPassword,
      sales_rep: addSales.value,
      district: addDistrict,
      tin: tin,
      region: addRegion.value,
    }).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        this.getRequest(tab === '0' ? true : false, activePage);
        this.setState({ openCreateDialog: false });
        this.resetAddDialog();
      } else {
        toastErrors(res);
      }
    });
  };

  editCustomerData = () => {
    const { editCustomer, getManagers, getRegions } = this.props;
    const {
      editPhone,
      chosenId,
      addEmail,
      addSales,
      addDirector,
      addDistrict,
      addProvince,
      addRegion,
      addClinicName,
      tin,
      addPhone,
      activePage,
      tab,
    } = this.state;
    editCustomer(chosenId, {
      clinic_email: addEmail,
      clinic_name: addClinicName,
      username: addDirector,
      province: addProvince,
      phone: addPhone,
      sales_rep: addSales.value,
      district: addDistrict,
      region: addRegion.value,
      tin: tin,
    }).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        this.getRequest(tab === '0' ? true : false, activePage);
        this.setState({ openCreateDialog: false });
      } else {
        toastErrors(res);
      }
    });
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event });
  };

  addInfoMeth = () => {
    const {
      addInfo,
      data: { role },
    } = this.props;
    const {
      addName,
      addEmail,
      addPhone,
      addDirector,
      addRegion,
      chosenId,
      addPassword,
      addProvince,
      addDistrict,
      addTin,
      addSales,
    } = this.state;
    const obj = {
      clinic_email: addEmail,
      clinic_name: addName,
      username: addDirector,
      phone: addPhone,
      password: addPassword,
      sales_rep: addSales.value,
      tin: addTin,
    };
    if (addProvince) {
      obj.province = addProvince;
    }
    if (addDistrict) {
      obj.district = addDistrict;
    }
    if (role === 'super_admin') {
      if (!addRegion) {
        toast('You need to select a region.', {
          progressClassName: 'red-progress',
        });
        return;
      }
      obj.country = addRegion && addRegion.value;
    }

    addInfo(chosenId, obj).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        this.getRequest(this.state.tab === '0', 1);
        this.setState({ openAddDialog: false });
        this.resetAddDialog();
      } else {
        toastErrors(res);
      }
    });
  };

  toggleAddDialog = () => {
    this.setState(({ openAddDialog }) => ({
      openAddDialog: !openAddDialog,
      error: null,
    }));
  };

  /*   resetAddDialog = () => {
    this.setState({
      addName: '',
      addEmail: '',
      addPhone: '',
      addRegion: null,
      chosenId: null,
      addDirector: '',
      addPassword: '',
      addProvince: '',
      addDistrict: '',
      addClinicName:"",
      addSales:"",
    });
  }; */

  render() {
    const {
      tab,
      activePage,
      customers,
      needApprovalCustomers,
      loading,
      openCreateDialog,
      openEditCustumerDialog,
      clinicName,
      director,
      phone,
      openAddDialog,
      addName,
      addEmail,
      addClinicName,
      addTin,
      tin,
      addSales,
      addPhone,
      addDirector,
      addRegion,
      addProvince,
      addDistrict,
      editPhone,
      editEmail,
      editSales,
      editDirector,
      editDistrict,
      editProvince,
      editRegion,
      editClinicName,
      chosenId,
      region_list,
      addPassword,
      inputValue,
    } = this.state;
    const {
      salesList,
      regionsList,
      history,
      data: { role },
    } = this.props;
    return (
      <div className="customers_page content_block">
        <div className="title_page">Customers</div>
        <div className="content_page">
          {role !== 'sales' && (
            <div className="tab_customers">
              <button className={tab === '0' ? 'active' : ''} onClick={() => this.changeTab('0')}>
                active customers
              </button>
              <button className={tab === '1' ? 'active' : ''} onClick={() => this.changeTab('1')}>
                new customers
                {needApprovalCustomers[0] ? <span /> : null}
              </button>
              {role === 'super_admin' && (
                <span onClick={() => history.push('/main/customers-inner-replace')}>
                  REPLACE CUSTOMER
                </span>
              )}
              {(role === 'region' || role === 'super_admin') && (
                <span
                  onClick={() => {
                    this.setState({ openCreateDialog: true });
                  }}>
                  + ADD CUSTOMER
                </span>
              )}
            </div>
          )}

          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <div className="table_panel">
                <input
                  placeholder="Search..."
                  value={inputValue}
                  onChange={(e) => {
                    this.liveSearch(tab == 1 ? false : true, 1, null, e.target.value);
                    this.setState({
                      inputValue: e.target.value,
                      activePage: 1,
                    });
                  }}
                />
              </div>
              {tab === '0' && (
                <div className="active_customers_table">
                  <div className="table_container transactions_columns">
                    <div className="table_header">
                      <div className="table_row">
                        <div className="row_item">Name</div>
                        <div className="row_item">Director</div>
                        <div className="row_item">Email</div>
                        <div className="row_item">Phone</div>
                        <div className="row_item">Products</div>
                        <div className="row_item"> {role !== 'sales' && 'Actions'} </div>
                      </div>
                    </div>
                    <div className="table_body">
                      {customers.results.map((el, id) => (
                        <div className="table_row" key={id}>
                          <div className="row_item">
                            {role !== 'sales' ? (
                              <Link to="#" onClick={() => this.moveToCustomerPage(el.id, el.name)}>
                                {el.name}
                              </Link>
                            ) : (
                              <>{el.name} </>
                            )}
                          </div>
                          <div className="row_item">{el.director ? el.director : '-'}</div>
                          <div className="row_item">{el.email ? el.email : '-'}</div>
                          <div className="row_item">{el.phone ? el.phone : '-'}</div>
                          <div className="row_item ">{el.products ? el.products : '-'}</div>
                          <div className="row_item edit-btn">
                            {role !== 'sales' && (
                              <button
                                onClick={() => {
                                  this.setState({
                                    openCreateDialog: true,
                                    openEditCustumerDialog: true,
                                    chosenId: el.id,
                                    addPhone: el.phone,
                                    addEmail: el.email,
                                    addSales: {
                                      label:
                                        el.sales_rep && el.sales_rep.username
                                          ? el.sales_rep.username
                                          : '',
                                      value:
                                        el.sales_rep && el.sales_rep.id ? el.sales_rep.id : null,
                                    },
                                    addDirector: el.director,
                                    addDistrict: el.district,
                                    addProvince: el.province,
                                    addRegion: {
                                      label:
                                        el.region && el.region.name ? el.region.name : el.region,
                                      value: el.region && el.region.id ? el.region.id : el.region,
                                    },
                                    addClinicName: el.name,
                                    tin: el.tin,
                                  });
                                }}>
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {customers.count <= 10 ? null : (
                    <div className="pagination_info_wrapper">
                      <div className="pagination_block">
                        <Pagination
                          active={activePage - 1}
                          pageCount={customers.total_pages}
                          /*pageItemsCount={20}
                                                 pageTotalCount={10}*/
                          onChange={this.changePage}
                        />
                      </div>
                      <div className="info">
                        Displaying page {activePage} of {customers.total_pages}, items{' '}
                        {activePage * 10 - 9} to{' '}
                        {activePage * 10 > customers.count ? customers.count : activePage * 10} of{' '}
                        {customers.count}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {tab === '1' && (
                <div className="approval_table">
                  {needApprovalCustomers[0] ? (
                    <Fragment>
                      <div className="table_container transactions_columns">
                        <div className="table_header">
                          <div className="table_row">
                            <div className="row">
                              <div className="row_item">Name</div>
                              <div className="row_item">Director</div>
                              <div className="row_item">Email</div>
                              <div className="row_item">Phone</div>
                              <div className="row_item">Actions</div>
                            </div>
                          </div>
                        </div>
                        <div className="table_body">
                          {customers.results.map((el, id) => (
                            <ExpansionPanel message={el.message} key={id}>
                              <div className="row" onClick={(e) => e.stopPropagation()}>
                                <div className="row_item">{el.name || '-'}</div>
                                <div className="row_item">
                                  {el.is_incomplete ? '-' : el.director ? el.director : '-'}
                                </div>
                                <div className="row_item">
                                  {el.is_incomplete ? '-' : el.email ? el.email : '-'}
                                </div>
                                <div className="row_item">{el.phone || '-'}</div>
                                <div className="row_item ">
                                  {el.is_incomplete ? (
                                    <button
                                      className="blue_text"
                                      onClick={() =>
                                        this.setState({
                                          openAddDialog: true,
                                          chosenId: el.id,
                                          addName: el.name,
                                        })
                                      }>
                                      add info
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        className="green_text"
                                        onClick={() => this.approveFunc(el.id, true)}>
                                        approve
                                      </button>
                                      <button
                                        className="red_text"
                                        onClick={() => this.approveFunc(el.id, false)}>
                                        Reject
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </ExpansionPanel>
                          ))}
                        </div>
                      </div>
                      {customers.count <= 10 ? null : (
                        <div className="pagination_info_wrapper">
                          <div className="pagination_block">
                            <Pagination
                              active={activePage - 1}
                              pageCount={customers.total_pages}
                              /*pageItemsCount={20}
                                                         pageTotalCount={10}*/
                              onChange={this.changePage}
                            />
                          </div>
                          <div className="info">
                            Displaying page {activePage} of {customers.total_pages}, items{' '}
                            {activePage * 10 - 9} to{' '}
                            {activePage * 10 > customers.count ? customers.count : activePage * 10}{' '}
                            of {customers.count}
                          </div>
                        </div>
                      )}
                    </Fragment>
                  ) : (
                    <h3>The list is empty</h3>
                  )}
                </div>
              )}
            </Fragment>
          )}
        </div>
        {(role === 'region' || role === 'super_admin') && (
          <DialogComponent
            open={openCreateDialog}
            onClose={() => {
              this.resetAddDialog();
            }}>
            <div className="regional_managers_edit_add_dialog">
              <div className="title">
                <span>{openEditCustumerDialog ? 'Edit customer' : 'Add customer'} </span>
              </div>
              <div className="block_edit_add_field ">
                <div className="name_item">
                  <span>Clinic name</span>
                  <input
                    type="text"
                    placeholder="Type here..."
                    value={addClinicName}
                    onChange={(e) =>
                      this.setState({
                        addClinicName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="tin_item">
                  <span>TIN</span>
                  <input
                    type="text"
                    placeholder="Type here..."
                    value={tin}
                    onChange={(e) =>
                      this.setState({
                        tin: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="block_edit_add_field  location">
                <div className="region_item">
                  <span>Region</span>
                  <FormControl className="select_wrapper">
                    <SelectComponent
                      name={`region`}
                      placeholder="Select…"
                      className="wide-field"
                      change={this.handleChange('addRegion')}
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
                      component={ReduxFormSelect}
                      value={
                        addRegion
                          ? addRegion
                          : {
                              region: 'None',
                              id: null,
                            }
                      }
                      isClearable={false}
                      isSearchable={true}
                    />
                  </FormControl>
                </div>
                <div className="region_item">
                  <span>Province</span>
                  <input
                    type="text"
                    placeholder="Type here..."
                    value={addProvince}
                    onChange={(e) =>
                      this.setState({
                        addProvince: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="region_item">
                  <span>District</span>
                  <input
                    type="text"
                    placeholder="Type here..."
                    value={addDistrict}
                    onChange={(e) =>
                      this.setState({
                        addDistrict: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="block_edit_add_field equal">
                <div>
                  <span>Director</span>
                  <input
                    type="text"
                    placeholder="Type here..."
                    value={addDirector}
                    onChange={(e) =>
                      this.setState({
                        addDirector: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <span>Sales rep.</span>
                  <FormControl className="select_wrapper">
                    <SelectComponent
                      name={`sales`}
                      placeholder="Select…"
                      className="wide-field"
                      value={addSales}
                      options={
                        salesList &&
                        [
                          {
                            username: 'None',
                            id: null,
                          },
                          ...salesList,
                        ].map((el) => ({
                          label: el.username,
                          value: el.id,
                        }))
                      }
                      component={ReduxFormSelect}
                      isClearable={false}
                      isSearchable={true}
                      change={this.handleChange('addSales')}
                    />
                  </FormControl>
                </div>
              </div>

              {openEditCustumerDialog ? (
                <div className="block_edit_add_field ">
                  <div className="form-email">
                    <span>Email</span>
                    <input
                      type="text"
                      placeholder="Type here..."
                      value={addEmail}
                      onChange={(e) =>
                        this.setState({
                          addEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-phone">
                    <span>Phone</span>
                    <input
                      type="text"
                      placeholder="Type here..."
                      value={addPhone}
                      onChange={(e) =>
                        this.setState({
                          addPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="block_edit_add_field ">
                  <div className="form-email-add">
                    <span>Email</span>
                    <input
                      type="text"
                      placeholder="Type here..."
                      value={addEmail}
                      onChange={(e) =>
                        this.setState({
                          addEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-edit-container">
                    <div className="form-phone-add">
                      <span>Phone</span>
                      <input
                        type="text"
                        placeholder="Type here..."
                        value={addPhone}
                        onChange={(e) =>
                          this.setState({
                            addPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-password-add">
                      <span>Password</span>
                      <input
                        type="password"
                        placeholder="Type here..."
                        value={addPassword}
                        onChange={(e) =>
                          this.setState({
                            addPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="btn_wrapper">
                <button
                  className="cancel_btn"
                  onClick={() => {
                    this.setState({
                      openCreateDialog: false,
                    });
                    this.resetAddDialog();
                  }}>
                  Cancel
                </button>
                <button
                  className="blue_btn"
                  onClick={openEditCustumerDialog ? this.editCustomerData : this.addCustomer}>
                  {openEditCustumerDialog ? 'Save' : 'Add'}
                </button>
              </div>
            </div>
          </DialogComponent>
        )}
        <DialogComponent
          open={openAddDialog}
          onClose={() => {
            this.toggleAddDialog();
            this.resetAddDialog();
          }}>
          <div className="regional_managers_edit_add_dialog">
            <div className="title">
              <span>Customer info</span>
            </div>
            <div className="block_edit_add_field">
              <div style={role !== 'super_admin' ? { width: '100%' } : []}>
                <span>Clinic name</span>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={addName}
                  style={role !== 'super_admin' ? { width: '100%' } : []}
                  onChange={(e) =>
                    this.setState({
                      addName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <span>TIN</span>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={addTin}
                  onChange={(e) =>
                    this.setState({
                      addTin: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="block_edit_add_field">
              {role === 'super_admin' && (
                <div className="select_block">
                  <span>Region</span>
                  <FormControl className="select_wrapper">
                    <SelectComponent
                      value={addRegion}
                      options={regionsList}
                      change={this.handleChange('addRegion')}
                      isClearable="false"
                      isSearchable={false}
                      placeholder="Select…"
                    />
                  </FormControl>
                </div>
              )}
              <div className="region_item">
                <span>Province</span>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={addProvince}
                  onChange={(e) =>
                    this.setState({
                      addProvince: e.target.value,
                    })
                  }
                />
              </div>
              <div className="region_item">
                <span>District</span>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={addDistrict}
                  onChange={(e) =>
                    this.setState({
                      addDistrict: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="block_edit_add_field">
              <div>
                <span>Director</span>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={addDirector}
                  onChange={(e) =>
                    this.setState({
                      addDirector: e.target.value,
                    })
                  }
                />
              </div>
              <div className="select_block">
                <span>Sales rep.</span>
                <FormControl className="select_wrapper">
                  <SelectComponent
                    name={`sales`}
                    placeholder="Select…"
                    className="wide-field"
                    value={addSales}
                    options={
                      salesList &&
                      [
                        {
                          username: 'None',
                          id: null,
                        },
                        ...salesList,
                      ].map((el) => ({
                        label: el.username,
                        value: el.id,
                      }))
                    }
                    component={ReduxFormSelect}
                    isClearable={false}
                    isSearchable={true}
                    change={this.handleChange('addSales')}
                  />
                </FormControl>
              </div>
            </div>
            <div className="block_edit_add_field">
              <div className="region_item">
                <span>Email</span>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={addEmail}
                  onChange={(e) =>
                    this.setState({
                      addEmail: e.target.value,
                    })
                  }
                />
              </div>
              <div className="region_item">
                <span>Phone</span>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={addPhone}
                  onChange={(e) =>
                    this.setState({
                      addPhone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="region_item">
                <span>Password</span>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={addPassword}
                  onChange={(e) =>
                    this.setState({
                      addPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.toggleAddDialog();
                  this.resetAddDialog();
                }}>
                Cancel
              </button>
              <button className="blue_btn" onClick={this.addInfoMeth}>
                Add
              </button>
            </div>
          </div>
        </DialogComponent>
      </div>
    );
  }
}
const validate = (values) => {
  const errors = {};
  if (!values.request) {
    errors.request = 'Required field';
  }
  if (!values.user) {
    errors.user = 'Required field';
  }
  if (!values.payment_status) {
    errors.payment_status = 'Required field';
  }
  if (!values.items || !values.items.length) {
    errors.items = 'You must fill in at least 1 product line.';
  } else {
    const itemsArrayErrors = [];
    values.items.forEach((el, idx) => {
      const itemsErrors = {};
      if (!el || !el.name) {
        itemsErrors.name = 'Required field';
        itemsArrayErrors[idx] = itemsErrors;
      }
      if (!el || !el.quantity) {
        itemsErrors.quantity = 'Required field';
        itemsArrayErrors[idx] = itemsErrors;
      }
    });
    if (itemsArrayErrors.length) {
      errors.items = itemsArrayErrors;
    }
  }

  return errors;
};

const CustomersEdit = reduxForm({
  form: 'Customers',
  validate,
  enableReinitialize: true,
})(Customers);

const selector = formValueSelector('Customers');

function mapStateToProps(state) {
  return {
    data: state.auth.data,
    salesList: state.orders.sales,
    regionsList: state.managers.regionsList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCustomers,
      approveAct,
      getSalesList,
      createCustomer,
      editCustomer,
      getRegions,
      addInfo,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomersEdit);
