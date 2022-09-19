import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import Ok from '../../assets/image/no-ok.svg';
import No from '../../assets/image/no.svg';
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponent";
import FormControl from "@material-ui/core/FormControl";
import SelectComponent from "../HelperComponents/SelectComponent/SelectComponent";
import "./RegionalManagers.scss";
import {
  getManagers,
  getCreditManagers,
  getRegions,
  createManager,
  deleteManager,
  changeManager,
  changeRegion,
  getSales,
  createSales,
  createRegion,
  createCreditManager,
  changeCreditManagers,
  deleteCreditManager,
  deleteSales,
  deleteRegion,
  changeSales,
} from "./../../actions/managersActions";
import { toastErrors } from "../../helpers/functions";

class RegionalManagers extends Component {
  state = {
    openDisableDialog: false,
    openDeleteDialog: false,
    openEnableDialog: false,
    openEditDialog: false,
    openAddDialog: false,
    addName: "",
    addEmail: "",
    addPassword: "",
    addOfficeAddress: "",
    addRegionName: "",
    addBankInfo: "",
    addRegion: null,
    chosenId: null,
    editName: "",
    editEmail: "",
    editPassword: "",
    editOfficeAddress: "",
    editRegionName: "",
    editBankInfo: "",
    editRegion: null,
    tab: "2",
  };

  changeTab = (tab) => {
    const { getManagers, getRegions, getSales, getCreditManagers } = this.props;
    this.setState({ tab });
    if (tab === "0") {
      getManagers();
    } else if (tab === "1") {
      getSales();
    } else if (tab === "3") {
      getCreditManagers();
    } else {
      getRegions();
    }
  };

  componentDidMount() {
    const { getManagers, getRegions, getCreditManagers } = this.props;
    getManagers();
    getRegions();
    getCreditManagers();
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event });
  };

  toggleDeleteDialog = (id = null) => {
    this.setState(({ openDeleteDialog }) => ({
      openDeleteDialog: !openDeleteDialog,
    }));
  };

  toggleDisableDialog = (id = null) => {
    this.setState(({ openDisableDialog }) => ({
      openDisableDialog: !openDisableDialog,
    }));
  };

  toggleEnableDialog = (id = null) => {
    this.setState(({ openEnableDialog }) => ({
      openEnableDialog: !openEnableDialog,
    }));
  };

  toggleEditDialog = (id = null) => {
    this.setState(({ openEditDialog }) => ({
      openEditDialog: !openEditDialog,
    }));
  };

  toggleAddDialog = (id = null) => {
    this.setState(({ openAddDialog }) => ({
      openAddDialog: !openAddDialog,
    }));
  };

  resetAddDialog = () => {
    this.setState({
      addName: "",
      addEmail: "",
      addPassword: "",
      addRegion: null,
      addOfficeAddress: "",
      addRegionName: "",
      addBankInfo: "",
    });
  };

  addManager = () => {
    const {
      createManager,
      getManagers,
      getCreditManagers,
      createCreditManager,
      createSales,
      getSales,
      getRegions,
    } = this.props;
    const { addName, addEmail, addPassword, addRegion, tab } = this.state;
    let createMethod, getMethod;

    if (tab === "0") {
      createMethod = createManager;
      getMethod = getManagers;
    } else if (tab === "1") {
      createMethod = createSales;
      getMethod = getSales;
    } else if (tab === "2") {
      createMethod = createRegion;
      getMethod = getRegions;
    } else if (tab === "3") {
      createMethod = createCreditManager;
      getMethod = getCreditManagers;
    }

    createMethod({
      email: addEmail,
      username: addName,
      manager_region: addRegion && addRegion.value,
      password: addPassword,
    }).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        getMethod();
        this.setState({ openAddDialog: false });
        this.resetAddDialog();
      } else {
        toastErrors(res);
      }
    });
  };

  disableManager = () => {
    const {
      changeManager,
      getManagers,
      getCreditManagers,
      changeCreditManagers,
      changeSales,
      getSales,
      changeRegion,
    } = this.props;
    const {
      chosenId,
      tab,
    } = this.state;

    let changeMethod, getMethod;

    if (tab === "0") {
      changeMethod = changeManager;
      getMethod = getManagers;
    } else if (tab === "1") {
      changeMethod = changeSales;
      getMethod = getSales;
    } else if (tab === "2") {
      changeMethod = changeRegion;
      getMethod = getRegions;
    } else if (tab === "3") {
      changeMethod = changeCreditManagers;
      getMethod = getCreditManagers;
    }

    const obj = {
      deleted: true,
    };
    changeMethod(chosenId, obj).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        getMethod();
        this.setState({ openDisableDialog: false });
      } else {
        toastErrors(res);
      }
    });
  };

  enableManager = () => {
    const {
      changeManager,
      getManagers,
      getCreditManagers,
      changeCreditManagers,
      changeSales,
      getSales,
      changeRegion,
    } = this.props;
    const {
      chosenId,
      tab,
    } = this.state;

    let changeMethod, getMethod;

    if (tab === "0") {
      changeMethod = changeManager;
      getMethod = getManagers;
    } else if (tab === "1") {
      changeMethod = changeSales;
      getMethod = getSales;
    } else if (tab === "2") {
      changeMethod = changeRegion;
      getMethod = getRegions;
    } else if (tab === "3") {
      changeMethod = changeCreditManagers;
      getMethod = getCreditManagers;
    }

    const obj = {
      deleted: false,
    };
    changeMethod(chosenId, obj).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        getMethod();
        this.setState({ openEnableDialog: false });
      } else {
        toastErrors(res);
      }
    });
  };

  editManager = () => {
    const {
      changeManager,
      getManagers,
      getCreditManagers,
      changeCreditManagers,
      changeSales,
      getSales,
      changeRegion,
    } = this.props;
    const {
      editName,
      editEmail,
      editPassword,
      editRegion,
      chosenId,
      tab,
    } = this.state;

    let changeMethod, getMethod;

    if (tab === "0") {
      changeMethod = changeManager;
      getMethod = getManagers;
    } else if (tab === "1") {
      changeMethod = changeSales;
      getMethod = getSales;
    } else if (tab === "2") {
      changeMethod = changeRegion;
      getMethod = getRegions;
    } else if (tab === "3") {
      changeMethod = changeCreditManagers;
      getMethod = getCreditManagers;
    }

    const obj = {
      email: editEmail,
      username: editName,
      manager_region: editRegion && editRegion.value,
    };
    if (editPassword) obj.password = editPassword;
    changeMethod(chosenId, obj).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        getMethod();
        this.setState({ openEditDialog: false });
        this.resetEditDialog();
      } else {
        toastErrors(res);
      }
    });
  };

  addRegion = () => {
    const {
      createManager,
      getManagers,
      createSales,
      createRegion,
      createCreditManager,
      getSales,
      getRegions,
    } = this.props;
    const { addOfficeAddress, addRegionName, addBankInfo, tab } = this.state;
    let createMethod, getMethod;

    if (tab === "2") {
      createMethod = createRegion;
      getMethod = getRegions;
    }

    createMethod({
      name: addRegionName,
      office_address: addOfficeAddress,
      bank_info: addBankInfo,
    }).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        getMethod();
        this.setState({ openAddDialog: false });
        this.resetAddDialog();
      } else {
        toastErrors(res);
      }
    });
  };

  editRegion = () => {
    const {
      changeManager,
      getManagers,
      getCreditManagers,
      changeCreditManagers,
      changeSales,
      getSales,
      changeRegion,
      getRegions,
    } = this.props;
    const {
      editOfficeAddress,
      editRegionName,
      editBankInfo,
      chosenId,
      tab,
    } = this.state;

    let changeMethod, getMethod;

    if (tab === "0") {
      changeMethod = changeManager;
      getMethod = getManagers;
    } else if (tab === "1") {
      changeMethod = changeSales;
      getMethod = getSales;
    } else if (tab === "2") {
      changeMethod = changeRegion;
      getMethod = getRegions;
    } else if (tab === "3") {
      changeMethod = changeCreditManagers;
      getMethod = getCreditManagers;
    }

    const obj = {
      name: editRegionName,
      office_address: editOfficeAddress,
      bank_info: editBankInfo,
    };
    changeMethod(chosenId, obj).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        getMethod();
        this.setState({ openEditDialog: false });
        this.resetEditDialog();
      } else {
        toastErrors(res);
      }
    });
  };

  render() {
    const {
      openDeleteDialog,
      openEditDialog,
      openEnableDialog,
      openDisableDialog,
      openAddDialog,
      region_type,
      addName,
      addEmail,
      addPassword,
      addRegion,
      chosenId,
      nameOfRemovedEl,
      editName,
      editEmail,
      editPassword,
      editOfficeAddress,
      editRegionName,
      editBankInfo,
      editRegion,
      addOfficeAddress,
      addRegionName,
      addBankInfo,
      tab,
    } = this.state;
    const {
      managers,
      regions,
      regionsList,
      loading,
      deleteManager,
      getManagers,
      getCreditManagers,
      deleteCreditManager,
      getRegions,
      deleteSales,
      getSales,
      deleteRegion,
    } = this.props;

    return (
        <div className="regional_managers content_block">
          <div className="custom_title_wrapper">
            <div className="title_page">Regions & representatives</div>
          </div>
          <div className="content_page">
            <div className="tab_customers">
              <div></div>
              <button
                  className={tab === "2" ? "active" : ""}
                  onClick={() => this.changeTab("2")}
              >
                regions
              </button>
              <button
                  className={tab === "0" ? "active" : ""}
                  onClick={() => this.changeTab("0")}
              >
                regional managers
              </button>
              <button
                  className={tab === "1" ? "active" : ""}
                  onClick={() => this.changeTab("1")}
              >
                sales reps.
              </button>

              <button
                  className={tab === "3" ? "active" : ""}
                  onClick={() => this.changeTab("3")}
              >
                credit managers
              </button>

              {tab === "2" ? (
                  <Link
                      className="add_link"
                      to="/main/regional-managers/add-region"
                  >
                    <span>+ ADD REGION</span>
                  </Link>
              ) : (
                  <span onClick={this.toggleAddDialog}>
                +
                    {tab === "0"
                        ? "ADD MANAGER"
                        : tab === "1"
                            ? "ADD SALES REP"
                            : tab === "3"
                                ? "ADD CREDIT MANAGER"
                                : "ADD REGION"}
              </span>
              )}
            </div>

            <div className="regional_managers_table">
              <div className="table_container transactions_columns">
                <div className="table_header">
                  <div className={tab === "2" ? "table_row region" : "table_row"}>
                    <div className="row_item">Name</div>
                    <div className="row_item">
                      {tab === "2" ? "Office address" : "Email"}
                    </div>
                    <div className="row_item">
                      {tab === "2" ? "Bank info" : "Region"}
                    </div>
                    {/* {tab === "2" && <div className="row_item vat"> VAT </div>} */}
                    <div className="row_item">
                      {tab !== "2" ? "Status" : ""}
                    </div>
                    <div className="row_item">Actions</div>
                  </div>
                </div>
                <div className={tab === "2" ? "table_body region" : "table_body"}>
                  {managers &&
                  tab !== "2" &&
                  managers.map(({ id, email, deleted, username, manager_region }) => (
                      <div className="table_row" key={id}>
                        <div className="row_item">
                          <Link
                              to={`/main/${
                                  tab === "0"
                                      ? "regional-managers"
                                      : tab === "3"
                                      ? "customer-statements"
                                      : "inner-sales"
                              }/${id}`}
                          >
                            {username}
                          </Link>
                        </div>
                        <div className="row_item">{email}</div>

                        <div className="row_item">
                          {regions.map(
                              (region) =>
                                  region.id === manager_region && region.name
                          )}
                        </div>


                        <div className="row_item">
                         <div>
                           {!deleted ?
                               <div className='status_active'><img src={Ok} alt="Ok"/>Active</div>
                               :
                               <div className='status_inactive'><img src={No} alt="No"/>Inactive</div>
                           }
                         </div>
                        </div>

                        <div className="row_item">
                          <button
                              className="blue_text"
                              onClick={() => {
                                this.toggleEditDialog();
                                this.setState({
                                  chosenId: id,
                                  editName: username,
                                  editEmail: email,
                                  editRegion: {
                                    label: regions.map(
                                        (region) =>
                                            region.id === manager_region && region.name
                                    ),
                                    value: manager_region,
                                  },
                                });
                              }}
                          >
                            Edit
                          </button>
                          {!deleted ?
                              <button
                                  className='disable'
                                  onClick={() => {
                                    this.setState({
                                      chosenId: id,
                                      nameOfRemovedEl: username,
                                    });
                                    this.toggleDisableDialog();
                                  }}
                              >
                                Disable
                              </button>
                              :
                              <button
                                  className="enable"
                                  onClick={() => {
                                    this.setState({
                                      chosenId: id,
                                      nameOfRemovedEl: username,
                                    });
                                    this.toggleEnableDialog();
                                  }}
                              >
                                Enable
                              </button>
                          }
                        </div>
                      </div>
                  ))}

                  {regions &&
                  tab === "2" &&
                  regions.map(({ id, name, address1, bank_info1, vat }) => (
                      <div className="table_row region" key={id}>
                        <div className="row_item">
                          <Link
                              to={`/main/${tab === "2" &&
                              "regional-managers/edit-redion/"}${id}`}
                          >
                            {name}
                          </Link>
                        </div>
                        <div className="row_item">{address1}...</div>
                        <div className="row_item">{bank_info1}...</div>
                        {/* <div className="row_item">{vat}%</div> */}
                        <div className="row_item">
                          <Link to={`/main/regional-managers/edit-redion/${id}`}>
                            <button className="blue_text">Edit</button>
                          </Link>
                          <button
                              className="red_text"
                              onClick={() => {
                                this.setState({
                                  chosenId: id,
                                  nameOfRemovedEl: name,
                                });
                                this.toggleDeleteDialog();
                              }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogComponent
              open={openDeleteDialog}
              onClose={this.toggleDeleteDialog}
          >
            <div className="regional_managers_delete_dialog">
              <div className="title">
              <span>
                Delete{" "}
                {tab === "0"
                    ? "regional manager"
                    : tab === "1"
                        ? "sales manager"
                        : tab === "3"
                            ? "credit manager"
                            : "region"}
              </span>
              </div>
              <div className="descriptions">
                You are about to delete <span>{nameOfRemovedEl}</span> from the
                system. <br />
                Are you sure?
              </div>
              <div className="btn_wrapper">
                <button className="cancel_btn" onClick={this.toggleDeleteDialog}>
                  Cancel
                </button>
                <button
                    className="red_btn"
                    onClick={() => {
                      let deleteMethod, getMethod;
                      if (tab === "0") {
                        deleteMethod = deleteManager;
                        getMethod = getManagers;
                      } else if (tab === "1") {
                        deleteMethod = deleteSales;
                        getMethod = getSales;
                      } else if (tab === "2") {
                        deleteMethod = deleteRegion;
                        getMethod = getRegions;
                      } else if (tab === "3") {
                        deleteMethod = deleteCreditManager;
                        getMethod = getCreditManagers;
                      }
                      deleteMethod(chosenId).then((res) => {
                        if (
                            res.payload &&
                            res.payload.status &&
                            res.payload.status === 204
                        ) {
                          getMethod();
                          this.setState({
                            openDeleteDialog: false,
                            chosenId: null,
                            ameOfRemovedEl: "",
                          });
                        } else {
                          toastErrors(res);
                        }
                      });
                    }}
                >
                  delete
                </button>
              </div>
            </div>
          </DialogComponent>

          <DialogComponent
              open={openEnableDialog}
              onClose={this.toggleEnableDialog}
          >
            <div className="regional_managers_delete_dialog">
              <div className="title">
              <span>
                Enable{" "}
                {tab === "0"
                    ? "regional manager"
                    : tab === "1"
                        ? "sales rep"
                        : tab === "3"
                            ? "credit manager"
                            : "region"}
              </span>
              </div>
              <div className="descriptions">
                Confirm that you want to enable <span>{nameOfRemovedEl}</span> to the system.
              </div>
              <div className="btn_wrapper">
                <button className="cancel_btn" onClick={this.toggleEnableDialog}>
                  Cancel
                </button>
                <button
                    className="blue_btn"
                    onClick={this.enableManager}
                >
                  Enable
                </button>
              </div>
            </div>
          </DialogComponent>

          <DialogComponent
              open={openDisableDialog}
              onClose={this.toggleDisableDialog}
          >
            <div className="regional_managers_delete_dialog">
              <div className="title">
              <span>
                Disable{" "}
                {tab === "0"
                    ? "regional manager"
                    : tab === "1"
                        ? "sales rep"
                        : tab === "3"
                            ? "credit manager"
                            : "region"}
              </span>
              </div>
              <div className="descriptions">
                You are about to disable <span>{nameOfRemovedEl}</span> from the system. <br/>
                Are you sure?
              </div>
              <div className="btn_wrapper">
                <button className="cancel_btn" onClick={this.toggleDisableDialog}>
                  Cancel
                </button>
                <button
                    className="red_btn"
                    onClick={this.disableManager}

                >
                  Disable
                </button>
              </div>
            </div>
          </DialogComponent>

          <DialogComponent
              open={openEditDialog}
              onClose={() => {
                this.toggleEditDialog();
                this.resetEditDialog();
              }}
          >
            <div className="regional_managers_edit_add_dialog">
              <div className="title">
                Edit{" "}
                {tab === "0"
                    ? "regional manager"
                    : tab === "1"
                        ? "sales manager"
                        : tab === "3"
                            ? "credit manager"
                            : "region"}{" "}
              </div>

              {tab !== "2" && (
                  <>
                    {" "}
                    <div className="block_edit_add_field">
                      <div>
                        <span>Name</span>
                        <input
                            type="text"
                            placeholder="Type here..."
                            value={editName}
                            onChange={(e) =>
                                this.setState({
                                  editName: e.target.value,
                                })
                            }
                        />
                      </div>
                      <div className="select_block">
                        <span>Region</span>

                        <FormControl className="select_wrapper">
                          <SelectComponent
                              value={editRegion}
                              options={regionsList}
                              change={this.handleChange("editRegion")}
                              isClearable={false}
                              isSearchable={false}
                              placeholder="Select…"
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div className="block_edit_add_field">
                      <div>
                        <span>Email</span>
                        <input
                            type="text"
                            placeholder="Type here..."
                            value={editEmail}
                            onChange={(e) =>
                                this.setState({
                                  editEmail: e.target.value,
                                })
                            }
                        />
                      </div>
                      <div>
                        <span>Password</span>
                        <input
                            type="text"
                            placeholder="Type here..."
                            value={editPassword}
                            onChange={(e) =>
                                this.setState({
                                  editPassword: e.target.value,
                                })
                            }
                        />
                      </div>
                    </div>
                  </>
              )}

              {tab === "2" && (
                  <>
                    {" "}
                    <div className="block_edit_add_field full-width">
                      <div>
                        <span>Name</span>
                        <input
                            type="text"
                            placeholder="Type here..."
                            value={editRegionName}
                            onChange={(e) =>
                                this.setState({
                                  editRegionName: e.target.value,
                                }, )
                            }
                        />
                      </div>
                    </div>
                    <div className="block_edit_add_field full-width">
                      <div>
                        <span>Office address</span>
                        <input
                            type="text"
                            placeholder="Type here..."
                            value={editOfficeAddress}
                            onChange={(e) =>
                                this.setState({
                                  editOfficeAddress: e.target.value,
                                })
                            }
                        />
                      </div>
                    </div>
                    <div className="block_edit_add_field full-width">
                      <div>
                        <span>Bank info</span>
                        <input
                            type="text"
                            placeholder="Type here..."
                            value={editBankInfo}
                            onChange={(e) =>
                                this.setState({
                                  editBankInfo: e.target.value,
                                })
                            }
                        />
                      </div>
                    </div>
                  </>
              )}

              <div className="btn_wrapper">
                <button
                    className="cancel_btn"
                    onClick={() => {
                      this.toggleEditDialog();
                      this.resetEditDialog();
                    }}
                >
                  Cancel
                </button>

                <button
                    className={editName  &&
                    editEmail  &&
                    editPassword  &&
                    editRegion && tab !== "2" ? "blue_btn" : "blue_btn_unactive"}
                    disabled={
                      tab !== "2" ?
                          !(editName  &&
                              editEmail  &&
                              editPassword  &&
                              editRegion ) : false
                    }
                    onClick={tab !== "2" ? this.editManager : this.editRegion}
                >
                  Save
                </button>
              </div>
            </div>
          </DialogComponent>

          <DialogComponent
              open={openAddDialog}
              onClose={() => {
                this.toggleAddDialog();
                this.resetAddDialog();
              }}
          >
            <div className="regional_managers_edit_add_dialog">
              <div className="title">

          
              <span>
                Add{" "}
                {tab === "0"
                    ? "regional manager"
                    : tab === "1"
                        ? "sales manager"
                        : tab === "3"
                            ? "credit manager"
                            : "region"}
              </span>
              </div>

              {tab !== "2" && (
                  <>
                    <div className="block_edit_add_field">
                      <div>
                        <span>Name</span>
                        <input
                            type="text"
                            placeholder="Type here..."
                            value={addName}
                            onChange={(e) =>
                                this.setState({
                                  addName: e.target.value,
                                })
                            }
                        />
                      </div>
                      <div className="select_block">
                        <span>Region</span>
                        <FormControl className="select_wrapper">
                          <SelectComponent
                              value={addRegion}
                              options={regionsList}
                              change={this.handleChange("addRegion")}
                              isClearable={false}
                              isSearchable={false}
                              placeholder="Select…"
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div className="block_edit_add_field">
                      <div>
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
                      <div>
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
                  </>
              )}

              {tab === "2" && (
                  <>
                    {" "}
                    <div className="block_edit_add_field full-width">
                      <div>
                        <span>Name</span>
                        <input
                            type="text"
                            placeholder="Type here..."
                            value={addRegionName}
                            onChange={(e) =>
                                this.setState({
                                  addRegionName: e.target.value,
                                })
                            }
                        />
                      </div>
                    </div>
                    <div className="block_edit_add_field full-width">
                      <div>
                        <span>Office address</span>
                        <input
                            type="text"
                            placeholder="Type here..."
                            value={addOfficeAddress}
                            onChange={(e) =>
                                this.setState({
                                  addOfficeAddress: e.target.value,
                                })
                            }
                        />
                      </div>
                    </div>
                    <div className="block_edit_add_field full-width">
                      <div>
                        <span>Bank info</span>
                        <input
                            type="text"
                            placeholder="Type here..."
                            value={addBankInfo}
                            onChange={(e) =>
                                this.setState({
                                  addBankInfo: e.target.value,
                                })
                            }
                        />
                      </div>
                    </div>
                  </>
              )}

              <div className="btn_wrapper">
                <button
                    className="cancel_btn"
                    onClick={() => {
                      this.toggleAddDialog();
                      this.resetAddDialog();
                    }}
                >
                  Cancel
                </button>
                {console.log(loading)}
                <button
                    className={addName  &&
                    addEmail  &&
                    addPassword  &&
                    addRegion && tab !== "2" && loading === false ? "blue_btn" : "blue_btn_unactive"}
                    disabled={
                      tab !== "2" ?
                          !(addName  &&
                              addEmail  &&
                              addPassword  &&
                              addRegion && !loading ) : false
                    }
                    onClick={tab === "2" ? this.addRegion : this.addManager}
                >
                  Add
                </button>
              </div>
            </div>
          </DialogComponent>
        </div>
    );
  }
}

function mapStateToProps({ managers }) {
  return {
    managers: managers.list,
    regions: managers.regions,
    regionsList: managers.regionsList,
    loading: managers.loading,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
      {
        getManagers,
        getCreditManagers,
        getRegions,
        createManager,
        deleteManager,
        changeManager,

        changeRegion,
        getSales,
        createSales,
        createRegion,
        changeCreditManagers,
        createCreditManager,
        deleteCreditManager,
        deleteRegion,
        deleteSales,
        changeSales,
      },
      dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionalManagers);
