import React, { useState, useEffect } from 'react';

import './ProductInner.scss';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Path from '../../../assets/image/Path.svg';
import { reduxForm, Field, change } from 'redux-form';
import FormControl from '@material-ui/core/FormControl';
import { useSelector, useDispatch } from 'react-redux';
import {
  getBrands,
  deleteImage,
  addImage,
  editProductNew,
  addBrand,
  addProductNew,
  replaceProductImOrders,
} from '../../../actions/productsActions';
import {
  getUnnecessaryList,
  productQuickCreate,
  getReplacedList,
} from '../../../actions/invoiceActions';

import { ReduxFormSelect } from './../../HelperComponents/RenderField/RenderField';
import { getCategories } from '../../../actions/catalogActions';
import DialogComponent from '../../HelperComponents/DialogComponent/DialogComponent';
import { ReactComponent as Arrow } from '../../../assets/image/arrow-right.svg';
import { ReactComponent as Product } from '../../../assets/image/products_icon.svg';
import { getInvoiceProductOptions } from '../../../actions/invoiceActions';
import no_actions from '../../../assets/image/no_actions.svg';
import no_ok from '../../../assets/image/no-ok.svg';
import new_icon from '../../../assets/image/new_icon.svg';
import no_partial from '../../../assets/image/no-partial.svg';
import Loader from '../../HelperComponents/ContentLoader/ContentLoader';
import { toast } from 'react-toastify';

const ProductInnerReplace = ({
  handleSubmit,
  addImage,
  history,
  addBrand,
  change,
  addProductNew,
}) => {
  useEffect(() => {
    dispatch(getInvoiceProductOptions());
  }, []);

  const dispatch = useDispatch();

  const { invoice_product_options, replaced_products, unnecessary_products, loading } = useSelector(
    ({ invoices }) => invoices,
  );

  const [error, setError] = useState(null);

  //Popup for add product
  const [openPopup, setOpenPopup] = useState(false);
  //Popup for accept replace
  const [openPopupAccept, setOpenPopupAccept] = useState(false);

  const [productName, setProductName] = useState('');

  const [unnecessaryProduct, setUnnecessaryProduct] = useState('');
  const [replaceProduct, setReplaceProduct] = useState('');

  const submitForm = (data) => {
    dispatch(
      replaceProductImOrders(replaceProduct.id, {
        products: [unnecessaryProduct.id],
      }),
    ).then((res) => {
      res && res.payload && res.payload.status === 200
        ? history.push(`/main/products`)
        : Object.values(res.error.response.data)
            .flat()
            .forEach((el) => toast.error(el, {}));
    });
  };

  //GET LIST OF UNNECESSARY PRODUCTS

  useEffect(() => {
    unnecessaryProduct &&
      unnecessaryProduct.id &&
      dispatch(getUnnecessaryList(unnecessaryProduct.id));
  }, [unnecessaryProduct]);

  //GET LIST OF REPLACED PRODUCTS

  useEffect(() => {
    replaceProduct && replaceProduct.id && dispatch(getReplacedList(replaceProduct.id));
  }, [replaceProduct]);

  return (
    <form className="product_inner content_block" onSubmit={handleSubmit(submitForm)}>
      <div className="custom_title_wrapper">
        <div className="link_req">
          <Link to="/main/products">
            <img src={Path} alt="Path" />
            products
          </Link>
        </div>
        <div className="title_page">Replace product</div>
        <div className="content_page">
          <div className="subtitle_block">
            Select an unnecessary product and replace it with a relevant one without harming the
            generated data
          </div>

          <section className="replace">
            <div className="replace__block">
              <div className="replace__dropdown">
                <span>Unnecessary product</span>
                <FormControl className="select_wrapper">
                  <Field
                    name="unnecessary_product"
                    placeholder="Start typing…"
                    className="wide-field"
                    options={
                      invoice_product_options &&
                      invoice_product_options.map((el) => ({
                        label: el.name,
                        value: el.name,
                        id: el.id,
                        price: el.price,
                        pack_size: el.pack_size,
                        expiration_date: el.expiration_date ? new Date(el.expiration_date) : null,
                      }))
                    }
                    onChange={(e) => {
                      setUnnecessaryProduct(e);
                    }}
                    component={ReduxFormSelect}
                    isClearable={false}
                    isSearchable={true}
                  />
                </FormControl>
              </div>
              <div className="replace__select">
                <span>Used in</span>
                {loading && <Loader />}
                {unnecessaryProduct && unnecessary_products.length === 0 && !loading && (
                  <div className="replace__empty">
                    <Product />
                    <span>{'There are no orders'}</span>
                  </div>
                )}

                {!unnecessaryProduct && !loading && (
                  <div className="replace__empty">
                    <Product />
                    <span>{'Select product'}</span>
                  </div>
                )}

                {unnecessaryProduct && unnecessary_products.length !== 0 && !loading && (
                  <ul className="replace__list">
                    {unnecessary_products.map(({ id, request, payment_status, status }) => (
                      <li className="replace__list--item" key={id}>
                        <p>
                          {status} {request}
                        </p>
                        {payment_status === 'overdue' ? (
                          <span className="status_block overdue">
                            <img src={no_actions} alt="Overdue" /> Overdue
                          </span>
                        ) : payment_status === 'paid' ? (
                          <span className="status_block paid">
                            <img src={no_ok} alt="paid" /> Paid
                          </span>
                        ) : payment_status === 'partial' ? (
                          <span className="status_block partial">
                            <img src={no_partial} alt="partial" /> Partial
                          </span>
                        ) : payment_status === 'new' ? (
                          <span className="status_block new">
                            <img src={new_icon} alt="new" /> New
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <Arrow />

            <div className="replace__conatiner">
              <div className="replace__block">
                <div className="replace__dropdown">
                  <span>Replace with</span>
                  <FormControl className="select_wrapper">
                    <Field
                      name="replace_product"
                      placeholder="Start typing…"
                      className="wide-field"
                      options={
                        invoice_product_options &&
                        invoice_product_options.map((el) => ({
                          label: el.name,
                          value: el.name,
                          id: el.id,
                          price: el.price,
                          pack_size: el.pack_size,
                          expiration_date: el.expiration_date ? new Date(el.expiration_date) : null,
                        }))
                      }
                      onChange={(e) => {
                        setReplaceProduct(e);
                      }}
                      component={ReduxFormSelect}
                      isClearable={false}
                      isSearchable={true}
                    />
                  </FormControl>
                </div>

                <div className="replace__select">
                  <span>Used in</span>
                  {loading && <Loader />}

                  {replaceProduct && replaced_products.length === 0 && !loading && (
                    <div className="replace__empty">
                      <Product />
                      <span>{'There are no orders'}</span>
                    </div>
                  )}

                  {!replaceProduct && !loading && (
                    <div className="replace__empty">
                      <Product />
                      <span>{'Select product'}</span>
                    </div>
                  )}
                  {replaceProduct && replaced_products.length !== 0 && !loading && (
                    <ul className="replace__list">
                      {replaced_products.map(({ id, request, payment_status, status }) => (
                        <li className="replace__list--item" key={id}>
                          <p>
                            {status} {request}
                          </p>
                          {payment_status === 'overdue' ? (
                            <span className="status_block overdue">
                              <img src={no_actions} alt="Overdue" /> Overdue
                            </span>
                          ) : payment_status === 'paid' ? (
                            <span className="status_block paid">
                              <img src={no_ok} alt="paid" /> Paid
                            </span>
                          ) : payment_status === 'partial' ? (
                            <span className="status_block partial">
                              <img src={no_partial} alt="partial" /> Partial
                            </span>
                          ) : payment_status === 'new' ? (
                            <span className="status_block new">
                              <img src={new_icon} alt="new" /> New
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setOpenPopup(true);
                }}
                className="replace__add--btn"
                type="button">
                + CREATE PRODUCT
              </button>
            </div>
          </section>

          <div className="wrapper_btn">
            <div>
              <button
                disabled={
                  !unnecessaryProduct ||
                  !replaceProduct ||
                  unnecessaryProduct.id === replaceProduct.id
                }
                className={
                  unnecessaryProduct &&
                  replaceProduct &&
                  unnecessaryProduct.id !== replaceProduct.id
                    ? 'blue_btn_bg'
                    : 'btn_unactive'
                }
                type="button"
                onClick={() => setOpenPopupAccept(true)}>
                Replace
              </button>
            </div>
          </div>
        </div>
      </div>
      <DialogComponent
        open={openPopup}
        onClose={() => {
          setOpenPopup(false);
          setProductName('');
        }}>
        <div className="edit_dialog">
          <div className="title">Create product</div>
          <div className={'block_add_field withMargin'}>
            <div className="name">
              <div className="block_field row">
                <span>Name</span>
                <span className={error ? '' : ''} />
              </div>
              <input
                onChange={(e) => setProductName(e.target.value)}
                value={productName}
                type="text"
                placeholder="Type here..."
              />
            </div>
          </div>

          <div className="btn_wrapper">
            <button
              className="cancel_btn"
              onClick={() => {
                setOpenPopup(false);
                setProductName('');
              }}>
              Cancel
            </button>
            <button
              className={
                productName === null || productName === '' ? 'blue_btn_unactive' : 'blue_btn'
              }
              disabled={productName === null || productName === ''}
              onClick={() => {
                dispatch(
                  productQuickCreate({
                    name: productName,
                  }),
                ).then((res) => {
                  if (res.payload && res.payload.status && res.payload.status === 201) {
                    dispatch(getInvoiceProductOptions());
                    setOpenPopup(false);
                    setProductName('');
                  } else {
                    Object.values(res.error.response.data)
                      .flat()
                      .forEach((el) =>
                        toast(el, {
                          progressClassName: 'red-progress',
                        }),
                      );
                  }
                });
              }}>
              Create
            </button>
          </div>
        </div>
      </DialogComponent>
      <DialogComponent
        open={openPopupAccept}
        onClose={() => {
          setOpenPopupAccept(false);
        }}>
        <div className="orders_dialog">
          <div className="title">
            <span>Replace product</span>
          </div>
          <div className="descriptions">
            <span>
              You are about to replace the <span>{unnecessaryProduct.value}</span> with{' '}
              <span>{replaceProduct.value}</span>.
              <br />
              Are you sure?
            </span>
          </div>
          <div className="btn_wrapper">
            <button className="cancel_btn" onClick={() => setOpenPopupAccept(false)}>
              Cancel
            </button>
            <button className="blue_btn" onClick={() => submitForm()}>
              Replace
            </button>
          </div>
        </div>
      </DialogComponent>
    </form>
  );
};

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  // if (!values.cost && values.cost !== 0) {
  //   errors.cost = 'Required';
  // }
  // if (!values.reorder_point && values.reorder_point !== 0) {
  //   errors.reorder_point = 'Required';
  // }
  // if (!values.on_hand && values.on_hand !== 0) {
  //   errors.on_hand = 'Required';
  // }
  // if (values.on_hand % 1 !== 0) {
  //   errors.on_hand = 'Should be integer';
  // }
  // if (!values.price && values.price !== 0) {
  //   errors.price = 'Required';
  // }
  return errors;
};

const ProductInnerAddForm = reduxForm({
  form: 'ProductInnerReplace',
  validate,
  // enableReinitialize: true,
})(ProductInnerReplace);

const mapStateToProps = ({ products, dashboard }) => {
  return {
    categories: dashboard.categories,
    brands: products.brands,
  };
};

const mapDispatchToProps = {
  getCategories,
  getBrands,
  deleteImage,
  addImage,
  editProductNew,
  addBrand,
  change,
  addProductNew,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductInnerAddForm);
