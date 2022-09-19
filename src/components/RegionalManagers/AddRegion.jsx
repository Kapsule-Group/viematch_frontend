import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Path from "../../assets/image/Path.svg";
import { reduxForm, formValueSelector, Field } from "redux-form";
import RenderField, {
  ReduxFormSelect,
} from "../HelperComponents/RenderField/RenderField";
import { useSelector, useDispatch } from "react-redux";
import {
  getRegion,
  handleChangeRegion,
  createRegion,
  changeRegion,
  handleClearRegion,
  clearSignnatureFile,
  clearLogoFile,
} from "../../actions/managersActions";
import "./RegionalManagers.scss";
import { toast } from "react-toastify";
import close from "../../assets/image/close.svg";
import document from "../../assets/image/document.svg";
import FormControl from "@material-ui/core/FormControl";
import SelectComponent from "../HelperComponents/SelectComponent/SelectComponent";

const AddRegion = ({ handleSubmit, history }) => {
  const {
    location: { pathname },
  } = useSelector(({ router }) => router);

  const {
    innerRegion: {
      name,
      phone_number,
      currency,
      prefix,
      address1,
      address2,
      address3,
      address4,
      address5,
      address6,
      address7,
      address8,
      bank_info1,
      bank_info2,
      bank_info3,
      bank_info4,
      delivery_info1,
      delivery_info2,
      delivery_info3,
      footer1,
      footer2,
      header,
      image,
      logo,
      //vat = 0,
    },
  } = useSelector(({ managers }) => managers);

  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(
    pathname === "/main/regional-managers/add-region"
  );
  const [tax_file, setTaxFile] = useState(null);
  const [logo_file, setLogoFile] = useState(null);

  const data = new FormData();

  const id = pathname && pathname.split("/").pop();

  useEffect(() => {
    dispatch(handleClearRegion());
    !isEdit && dispatch(getRegion(id));
    setIsEdit(pathname === "/main/regional-managers/add-region");
  }, []);

  const valuesOgj = {
    address1: address1,
    address2: address2,
    address3: address3,
    address4: address4,
    address5: address5,
    address6: address6,
    address7: address7,
    address8: address8,
  };

  const Currencies_list = [
    { label: "USD", value: "USD" },
    { label: "RWF", value: "RWF" },
    { label: "BRF", value: "BRF" },
    { label: "KSh", value: "KSh" },
  ];

  const bankInfo = [bank_info1, bank_info2, bank_info3, bank_info4];
  const deliveryInfo = [delivery_info1, delivery_info2, delivery_info3];
  const footerInfo = [footer1, footer2];
  const headerInfo = [header];

  return (
    <div className="regional_managers content_block">
      <div className="link_back">
        <Link to="/main/regional-managers/">
          <img src={Path} alt="Path" />
          Regions & representatives
        </Link>
      </div>
      <div className="custom_title_wrapper">
        <div className="title_page">{isEdit ? "Add region" : name}</div>
      </div>
      <div className="content_page">
        <form
          className="add_form"
          onSubmit={handleSubmit(() =>
            dispatch(
              isEdit
                ? (data.append("name", name),
                  data.append("currency", currency),
                  data.append("phone_number", phone_number),
                  data.append("prefix", prefix),
                  //vat ? data.append("vat", vat) : data.append("vat", 0),
                  data.append("image", tax_file ? tax_file.tax_file : []),
                  data.append("logo", logo_file ? logo_file.logo_file : []),
                  //(image === '' || image === null) && data.append('image', []),
                  address1 && data.append("address1", address1),
                  address2 && data.append("address2", address2),
                  address3 && data.append("address3", address3),
                  address4 && data.append("address4", address4),
                  address5 && data.append("address5", address5),
                  address6 && data.append("address6", address6),
                  address7 && data.append("address7", address7),
                  address8 && data.append("address8", address8),
                  bank_info1 && data.append("bank_info1", bank_info1),
                  bank_info2 && data.append("bank_info2", bank_info2),
                  bank_info3 && data.append("bank_info3", bank_info3),
                  bank_info4 && data.append("bank_info4", bank_info4),
                  header && data.append("header", header),
                  delivery_info1 &&
                    data.append("delivery_info1", delivery_info1),
                  delivery_info2 &&
                    data.append("delivery_info2", delivery_info2),
                  delivery_info3 &&
                    data.append("delivery_info3", delivery_info3),
                  footer1 && data.append("footer1", footer1),
                  footer2 && data.append("footer2", footer2),
                  createRegion(data))
                : ((tax_file &&
                    tax_file.tax_file &&
                    data.append("image", tax_file.tax_file),
                  logo_file &&
                    logo_file.logo_file &&
                    data.append("logo", logo_file.logo_file),
                  (image === "" || image === null) && data.append("image", []),
                  (logo === "" || logo === null) && data.append("logo", []),
                  data.append("name", name),
                  data.append("phone_number", phone_number),
                  data.append("prefix", prefix),
                  data.append("currency", currency),
                 // vat ? data.append("vat", vat) : data.append("vat", 0),
                  data.append("address1", address1),
                  data.append("address2", address2),
                  data.append("address3", address3),
                  data.append("address4", address4),
                  data.append("address5", address5),
                  data.append("address6", address6),
                  data.append("address7", address7),
                  data.append("address8", address8),
                  data.append("bank_info1", bank_info1),
                  data.append("bank_info2", bank_info2),
                  data.append("bank_info3", bank_info3),
                  data.append("bank_info4", bank_info4)),
                  data.append("header", header),
                  data.append("delivery_info1", delivery_info1),
                  data.append("delivery_info2", delivery_info2),
                  data.append("delivery_info3", delivery_info3),
                  data.append("footer1", footer1),
                  data.append("footer2", footer2),
                  changeRegion(id, data))
            ).then((res) => {
              res &&
              res.payload &&
              (res.payload.status === 201 || res.payload.status === 200)
                ? history.push("/main/regional-managers")
                : Object.values(res.error.response.data)
                    .flat()
                    .forEach((el) => toast.error(el, {}));
            })
          )}
        >
          <div className="info_wrapper add-region-params">
            <div>
              <div className="block_field name-block">
                <span>Name*</span>
                <label className="block-input">
                  <input
                    value={name}
                    name="name"
                    type="text"
                    maxLength={50}
                    component={RenderField}
                    placeholder="Type here…"
                    onChange={(e) =>
                      dispatch(handleChangeRegion("name", e.target.value))
                    }
                  />
                </label>
              </div>
              <div className="block_field phone-block">
                <span>Phone</span>
                <label className="block-input">
                  <input
                    value={phone_number}
                    name="phone_number"
                    type="text"
                    maxLength={50}
                    component={RenderField}
                    placeholder="Type here…"
                    onChange={(e) =>
                      dispatch(
                        handleChangeRegion("phone_number", e.target.value)
                      )
                    }
                  />
                </label>
              </div>

              <div className="block_field prefix-block">
                <span>ID/PI# prefix*</span>
                <label className="block-input prefix-block">
                  <input
                    value={prefix}
                    name="prefix"
                    type="text"
                    maxLength={3}
                    component={RenderField}
                    placeholder="Type here…"
                    onChange={(e) =>
                      dispatch(handleChangeRegion("prefix", e.target.value))
                    }
                  />
                </label>
              </div>
            </div>
            <div>
              <div className="block_field currency-block">
                <span>Default currency*</span>
                <FormControl className="select_wrapper">
                  <SelectComponent
                    value={{ label: currency, value: currency }}
                    options={Currencies_list}
                    placeholder="Select…"
                    isClearable={false}
                    isSearchable={false}
                    change={(e) =>
                      dispatch(handleChangeRegion("currency", e.value))
                    }
                  />
                </FormControl>
              </div>
            </div>
          </div>
          <div className="info_wrapper">
            <div className="info_title">
              <span>images</span>
              <div className="block_field stamp-block">
                {logo_file !== null || logo ? (
                  <>
                    <span>Logo</span>
                    <div className="stamp-block-row">
                      <img src={document} alt="document" />
                      <p className="stamp-block-title">
                        {(logo &&
                          logo.split("/")[logo.split("/").length - 1]) ||
                          logo_file.logo_file.name}
                      </p>
                      <button
                        type={"button"}
                        className="stamp-block-btn"
                        onClick={() => {
                          setLogoFile(null);
                          dispatch(clearLogoFile());
                        }}
                      >
                        <img src={close} alt="close" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>Logo</span>
                    <label htmlFor="fileInp" className="blue_btn">
                      Upload
                    </label>
                    <input
                      style={{
                        display: "none",
                      }}
                      type="file"
                      accept="image/*"
                      id="fileInp"
                      onChange={(e) => {
                        let logo_file = e.target.files[0];
                        setLogoFile({
                          logo_file,
                        });
                      }}
                    />
                  </>
                )}
              </div>
              <div className="block_field stamp-block">
                {tax_file !== null || image ? (
                  <>
                    <span>Stamp picture</span>
                    <div className="stamp-block-row">
                      <img src={document} alt="document" />
                      <p className="stamp-block-title">
                        {(image &&
                          image.split("/")[image.split("/").length - 1]) ||
                          tax_file.tax_file.name}
                      </p>
                      <button
                        type={"button"}
                        className="stamp-block-btn"
                        onClick={() => {
                          setTaxFile(null);
                          dispatch(clearSignnatureFile());
                        }}
                      >
                        <img src={close} alt="close" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>Stamp picture</span>
                    <label htmlFor="fileInp1" className="blue_btn">
                      Upload
                    </label>
                    <input
                      style={{
                        display: "none",
                      }}
                      type="file"
                      accept="image/*"
                      id="fileInp1"
                      onChange={(k) => {
                        let tax_file = k.target.files[0];
                        setTaxFile({
                          tax_file,
                        });
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="info_wrapper">
            <div className="info_title">
              <span>header</span>
            </div>
            {headerInfo.map((el, idx) => (
              <div key={idx} className="block_field">
                <span>Line {idx + 1}</span>
                <label className="block-input">
                  <input
                    value={el}
                    name={!isEdit ? `line${idx + 1}` : ""}
                    type="text"
                    maxlength="70"
                    component={RenderField}
                    placeholder="Type here…"
                    onChange={(e) =>
                      dispatch(handleChangeRegion(`header`, e.target.value))
                    }
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="info_wrapper">
            <div className="info_title">
              <span>office info</span>
            </div>
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="block_field">
                <span>Line {idx + 1}</span>
                <label className="block-input">
                  <input
                    value={valuesOgj[`address${idx + 1}`]}
                    name={`line${idx + 1}`}
                    type="text"
                    maxlength="70"
                    component={RenderField}
                    placeholder="Type here…"
                    onChange={(e) =>
                      dispatch(
                        handleChangeRegion(`address${idx + 1}`, e.target.value)
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="info_wrapper">
            <div className="info_title">
              <span>bank info</span>
            </div>
            {bankInfo.map((el, idx) => (
              <div key={idx} className="block_field">
                <span>Line {idx + 1}</span>
                <label className="block-input">
                  <input
                    value={el}
                    name={!isEdit ? `line${idx + 1}` : ""}
                    type="text"
                    maxlength="70"
                    component={RenderField}
                    placeholder="Type here…"
                    onChange={(e) =>
                      dispatch(
                        handleChangeRegion(
                          `bank_info${idx + 1}`,
                          e.target.value
                        )
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="info_wrapper">
            <div className="info_title">
              <span>delivery info</span>
            </div>
            {deliveryInfo.map((el, idx) => (
              <div key={idx} className="block_field">
                <span>Line {idx + 1}</span>
                <label className="block-input">
                  <input
                    value={el}
                    name={!isEdit ? `line${idx + 1}` : ""}
                    type="text"
                    maxlength="70"
                    component={RenderField}
                    placeholder="Type here…"
                    onChange={(e) =>
                      dispatch(
                        handleChangeRegion(
                          `delivery_info${idx + 1}`,
                          e.target.value
                        )
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="info_wrapper">
            <div className="info_title">
              <span>footer</span>
            </div>
            {footerInfo.map((el, idx) => (
              <div key={idx} className="block_field">
                <span>Line {idx + 1}</span>
                <label className="block-input">
                  <input
                    value={el}
                    name={!isEdit ? `line${idx + 1}` : ""}
                    type="text"
                    maxlength="200"
                    component={RenderField}
                    placeholder="Type here…"
                    onChange={(e) =>
                      dispatch(
                        handleChangeRegion(`footer${idx + 1}`, e.target.value)
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>
          {
            <button
              className={
                (name === "" || prefix === "" || currency === "") &&
                "blue_btn_unactive"
              }
              disabled={name === "" || prefix === "" || currency === ""}
            >
              {isEdit ? "ADD REGION" : "SAVE CHANGES"}
            </button>
          }
        </form>
      </div>
    </div>
  );
};

const validate = (values) => {
  const errors = {};

  return errors;
};

const AddRegions = reduxForm({
  form: "AddRegions",
  validate,
})(AddRegion);

const selector = formValueSelector("AddRegion");

export default AddRegions;
