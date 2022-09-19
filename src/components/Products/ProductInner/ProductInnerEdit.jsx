import React, { useState, useEffect } from 'react';
import './ProductInner.scss';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Path from '../../../assets/image/Path.svg';
import { reduxForm, Field, change } from 'redux-form';
import RenderField, { renderDatePicker } from '../../HelperComponents/RenderField/RenderField';
import {
  getSingleProduct,
  getBrands,
  deleteImage,
  addImage,
  editProductNew,
  addBrand,
} from '../../../actions/productsActions';
import { getCategories } from './../../../actions/catalogActions';
import FormControl from '@material-ui/core/FormControl';
import { createNumberMask } from 'redux-form-input-masks';
import moment from 'moment';
import { ReduxFormSelect } from '../../HelperComponents/RenderField/RenderField';
import { DefaultEditor } from 'react-simple-wysiwyg';
import NoPhoto from '../../../assets/image/add_photo-1.svg';
import DeletePhoto from '../../../assets/image/delete_photo.svg';
import DialogComponent from '../../HelperComponents/DialogComponent/DialogComponent';
import NoMainPhoto from '../../../assets/image/no_main_img.svg';
import { toast } from 'react-toastify';

const ProductInnerEdit = ({
  handleSubmit,
  getSingleProduct,
  match: {
    params: { id },
  },
  data: { name, extra_images },
  categories,
  getCategories,
  getBrands,
  brands,
  deleteImage,
  addImage,
  editProductNew,
  history,
  addBrand,
  role,
  change,
}) => {
  useEffect(() => {
    getSingleProduct(id).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        res.payload.data &&
          res.payload.data.description &&
          setDescription(res.payload.data.description);
        res.payload.data &&
          res.payload.data.image &&
          setMainImage({ image: res.payload.data.image });
      }
    });
    getCategories();
    getBrands();
  }, []);

  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [openEnd, setOpenDate] = useState(false);

  const {
    singleProduct: { on_hand },
  } = useSelector(({ products }) => products);

  const submitForm = (data) => {
    const {
      name,
      code,
      cost,
      price,
      on_hand,
      reorder_point,
      category,
      brand,
      financial_category,
      pack_size,
      expiration_date,
    } = data;

    if (!mainImage) {
      toast('Main image is required.', {
        progressClassName: 'red-progress',
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('cost', cost);
    formData.append('on_hand', on_hand);
    formData.append('price', price);
    formData.append('reorder_point', reorder_point);
    formData.append('description', description);
    formData.append('pack_size', pack_size);
    expiration_date
      ? formData.append(
          'expiration_date',
          moment(expiration_date)
            .utcOffset(0)
            .format('YYYY-MM-DD'),
        )
      : formData.append('expiration_date', '');

    if (category && category.id) {
      formData.append('subcategory', category.id);
    }
    if (brand && brand.id) {
      formData.append('brand', brand.id);
    }
    if (financial_category) {
      formData.append('financial_category', financial_category.value);
    }
    if (mainImage && mainImage.file) {
      formData.append('image', mainImage.file);
    }

    editProductNew(formData, id).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        history.push(`/main/products`);
      } else {
        if (res.error && res.error.response && res.error.response.data) {
          Object.values(res.error.response.data)
            .flat()
            .forEach((el) =>
              toast(el, {
                progressClassName: 'red-progress',
              }),
            );
        } else {
          toast('Something went wrong.', {
            progressClassName: 'red-progress',
          });
        }
        return;
      }
    });
  };

  const [openBrand, setOpenBrand] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [error, setError] = useState(null);

  const noneType = 'None';

  const currencyMask = createNumberMask({
    decimalPlaces: 0,
    locale: 'en-US',
  });

  const financialCategories = [
    { value: 'None', label: 'None' },
    { value: 'pharmacy', label: 'Pharmacy (B2C) Products' },
    { value: 'consumable', label: 'Hospital Consumables' },
    { value: 'equipment', label: 'Hospital Equipment' },
  ];

  return (
    <form className="product_inner content_block" onSubmit={handleSubmit(submitForm)}>
      <div className="custom_title_wrapper">
        <div className="link_req">
          <Link to="/main/products">
            <img src={Path} alt="Path" />
            products
          </Link>
        </div>
        <div className="title_page">{name}</div>
        <div className="content_page">
          <div className="title_block">general info</div>
          <div className="general_info">
            <div className="block_field">
              <div>
                <span>Name</span>
                <Field
                  type="string"
                  name="name"
                  placeholder="Type here..."
                  component={RenderField}
                />
              </div>
              <div>
                <span>SKU</span>
                <Field
                  type="string"
                  name="code"
                  placeholder="Type here..."
                  component={RenderField}
                  disabled
                />
              </div>
            </div>
            <div className="block_field">
              <div>
                <span>Category</span>
                <FormControl className="select_wrapper">
                  <Field
                    name={`category`}
                    placeholder="Select category…"
                    className="wide-field"
                    options={
                      categories &&
                      categories.map((el) => ({
                        label: el.name,
                        value: el.name,
                        id: el.id,
                      }))
                    }
                    component={ReduxFormSelect}
                    isClearable={false}
                    isSearchable={true}
                  />
                </FormControl>
              </div>
              <div>
                <span>Brand</span>
                <FormControl className="select_wrapper">
                  <Field
                    name={`brand`}
                    placeholder="Select brand…"
                    className="wide-field"
                    options={
                      brands &&
                      brands.map((el) => ({
                        label: el.name,
                        value: el.name,
                        id: el.id,
                      }))
                    }
                    component={ReduxFormSelect}
                    isClearable={false}
                    isSearchable={true}
                  />
                </FormControl>
              </div>
              <div onClick={() => setOpenBrand(true)} className="add-btn mt40">
                + ADD BRAND
              </div>
            </div>
            {
              <div className="block_field">
                <div>
                  <span>Financing category</span>
                  <FormControl className="select_wrapper">
                    <Field
                      name={`financial_category`}
                      placeholder="Select category…"
                      className="wide-field"
                      options={financialCategories.map((el) => ({
                        label: el.label,
                        value: el.value,
                      }))}
                      component={ReduxFormSelect}
                      isClearable={false}
                      isSearchable={true}
                    />
                  </FormControl>
                </div>
              </div>
            }
            <div className="block_field four-fields">
              <div>
                <span>Sales price</span>
                <Field
                  currency={'USD'}
                  name="price"
                  placeholder="0"
                  component={RenderField}
                  {...currencyMask}
                />
              </div>
              <div>
                <span>Cost</span>
                <Field
                  currency={'USD'}
                  name="cost"
                  placeholder="0"
                  component={RenderField}
                  {...currencyMask}
                />
              </div>
              <div>
                <span>Qty on hand</span>
                <Field name="on_hand" type="number" placeholder="0" component={RenderField} />
              </div>
              <div>
                <span>Reorder point</span>
                <Field
                  name="reorder_point"
                  placeholder="0"
                  component={RenderField}
                  {...currencyMask}
                />
              </div>

              <div>
                <span>Pack size</span>
                <Field type="text" name="pack_size" placeholder="Type..." component={RenderField} />
              </div>

              <div className={openEnd ? 'date-picker disabled' : 'date-picker'}>
                <span>Expiration date</span>
                <Field
                  className="calendar"
                  type="text"
                  name="expiration_date"
                  isExpiration
                  isClearable
                  component={renderDatePicker}
                  disabled={openEnd}
                />
              </div>
            </div>
            <div className="description">
              <span>Description</span>
              <DefaultEditor value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <p className="photos-header">photos</p>
          <p className="photos-description">Upload main and up to five additional images</p>
          <div className="main-photos-wrapper">
            <div>
              <p>Main image</p>
              <div>
                {mainImage ? (
                  <div className="main-solo-photo">
                    <img src={mainImage.image} className="main-photo" />
                    <img
                      src={DeletePhoto}
                      className="delete-icon"
                      onClick={() => {
                        setMainImage(null);
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <label>
                      <img src={NoMainPhoto} className="main-photo" />
                      <input
                        type="file"
                        id="fileCreate"
                        style={{ display: 'none' }}
                        accept="image/jpg, image/jpeg, image/png"
                        onChange={(e) => {
                          let fileItem = e.target.files[0];
                          let image = URL.createObjectURL(fileItem);
                          if (fileItem) {
                            setMainImage({
                              image,
                              file: fileItem,
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p>Additional images</p>
              <div className="photos-wrapper">
                {extra_images &&
                  [...extra_images, '', '', '', '', ''].slice(0, 5).map((el, idx) =>
                    el ? (
                      <div key={idx}>
                        <img src={el.image} className="main-photo" />
                        <img
                          src={DeletePhoto}
                          className="delete-icon"
                          onClick={() =>
                            deleteImage(el.id).then((res) => {
                              if (res.payload && res.payload.status && res.payload.status === 204) {
                                getSingleProduct(id);
                              }
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div key={idx}>
                        <label>
                          <img src={NoPhoto} className="main-photo" />
                          <input
                            type="file"
                            id="fileCreate"
                            style={{
                              display: 'none',
                            }}
                            accept="image/jpg, image/jpeg, image/png"
                            onChange={(e) => {
                              let fileItem = e.target.files[0];
                              if (fileItem) {
                                const formData = new FormData();
                                formData.append('image', fileItem);
                                addImage(id, formData).then((res) => {
                                  if (
                                    res.payload &&
                                    res.payload.status &&
                                    res.payload.status === 201
                                  ) {
                                    getSingleProduct(id);
                                  }
                                });
                              }
                            }}
                          />
                        </label>
                      </div>
                    ),
                  )}
              </div>
            </div>
          </div>

          <div className="wrapper_btn">
            <div>
              <button className="blue_btn_bg" formAction>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <DialogComponent
        open={openBrand}
        onClose={() => {
          setBrandName('');
          setOpenBrand(false);
          setError(null);
        }}>
        <div className="edit_dialog">
          <div className="title">Add brand</div>
          <div className={'block_add_field'}>
            <div className="name">
              <div className="block_field row">
                <span>Name</span>
                <span className={error ? '' : ''} />
              </div>
              <input
                onChange={(e) => setBrandName(e.target.value)}
                value={brandName}
                type="text"
                placeholder="Type here..."
              />
            </div>
          </div>
          <span className={error ? 'error visible' : 'error'}>{error}</span>
          <div className="btn_wrapper">
            <button
              className="cancel_btn"
              onClick={() => {
                setBrandName('');
                setOpenBrand(false);
                setError(null);
              }}>
              Cancel
            </button>
            <button
              className="blue_btn"
              onClick={() => {
                addBrand({
                  name: brandName,
                }).then((res) => {
                  if (res.payload && res.payload.status && res.payload.status === 201) {
                    const { name, id } = res.payload.data;
                    change('brand', {
                      label: name,
                      value: name,
                      id: id,
                    });
                    setBrandName('');
                    setOpenBrand(false);
                    setError(null);
                  } else {
                  }
                });
              }}>
              Add
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
  if (!values.cost && values.cost !== 0) {
    errors.cost = 'Required';
  }
  if (!values.reorder_point && values.reorder_point !== 0) {
    errors.reorder_point = 'Required';
  }
  if (!values.on_hand && values.on_hand !== 0) {
    errors.on_hand = 'Required';
  }
  if (values.on_hand % 1 !== 0) {
    errors.on_hand = 'Should be integer';
  }
  if (!values.price && values.price !== 0) {
    errors.price = 'Required';
  }
  return errors;
};

const ProductInnerEditForm = reduxForm({
  form: 'ProductInnerEdit',
  validate,
  enableReinitialize: true,
})(ProductInnerEdit);

const mapStateToProps = ({ products, auth, dashboard }) => {
  return {
    data: products.singleProduct,
    role: auth.data.role,
    categories: dashboard.categories,
    brands: products.brands,
    initialValues: {
      name: products && products.singleProduct.name,
      code: products && products.singleProduct.code,
      category: {
        value:
          products &&
          dashboard &&
          dashboard.categories.find((el) => el.id === products.singleProduct.subcategory) &&
          dashboard.categories.find((el) => el.id === products.singleProduct.subcategory).name,
        label:
          products &&
          dashboard &&
          dashboard.categories.find((el) => el.id === products.singleProduct.subcategory) &&
          dashboard.categories.find((el) => el.id === products.singleProduct.subcategory).name,
        id:
          products &&
          dashboard &&
          dashboard.categories.find((el) => el.id === products.singleProduct.subcategory) &&
          dashboard.categories.find((el) => el.id === products.singleProduct.subcategory).id,
      },
      financial_category: {
        value: products && products.singleProduct.financial_category,
        label:
          products && products.singleProduct.financial_category === 'equipment'
            ? 'Hospital Equipment'
            : products.singleProduct.financial_category === 'consumable'
            ? 'Hospital Consumables'
            : products.singleProduct.financial_category === 'pharmacy'
            ? 'Pharmacy (B2C) Products'
            : 'None',
      },

      brand: {
        value:
          products &&
          products.brands.find((el) => el.id == products.singleProduct.brand) &&
          products.brands.find((el) => el.id == products.singleProduct.brand).name,
        label:
          products &&
          products.brands.find((el) => el.id == products.singleProduct.brand) &&
          products.brands.find((el) => el.id == products.singleProduct.brand).name,
        id:
          products &&
          products.brands.find((el) => el.id == products.singleProduct.brand) &&
          products.brands.find((el) => el.id == products.singleProduct.brand).id,
      },
      price: products && products.singleProduct.price,
      cost: products && products.singleProduct.cost,
      on_hand: products && products.singleProduct.on_hand,
      reorder_point: products && products.singleProduct.reorder_point,
      pack_size:
        products && products.singleProduct.pack_size ? products.singleProduct.pack_size : null,
      expiration_date:
        products && products.singleProduct.expiration_date
          ? new Date(products.singleProduct.expiration_date)
          : null,
    },
  };
};

const mapDispatchToProps = {
  getSingleProduct,
  getCategories,
  getBrands,
  deleteImage,
  addImage,
  editProductNew,
  addBrand,
  change,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductInnerEditForm);
