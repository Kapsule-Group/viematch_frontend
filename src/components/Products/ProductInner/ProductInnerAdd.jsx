import React, { useState, useEffect } from 'react';
import './ProductInner.scss';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Path from '../../../assets/image/Path.svg';
import { reduxForm, Field, change } from 'redux-form';
import RenderField, { renderDatePicker } from '../../HelperComponents/RenderField/RenderField';
import {
  getBrands,
  deleteImage,
  addImage,
  editProductNew,
  addBrand,
  addProductNew,
} from '../../../actions/productsActions';
import { getCategories } from './../../../actions/catalogActions';
import DialogComponent from '../../HelperComponents/DialogComponent/DialogComponent';
import NoPhoto from '../../../assets/image/add_photo-1.svg';
import DeletePhoto from '../../../assets/image/delete_photo.svg';
import FormControl from '@material-ui/core/FormControl';
import { ReduxFormSelect } from '../../HelperComponents/RenderField/RenderField';
import { DefaultEditor } from 'react-simple-wysiwyg';
import NoMainPhoto from '../../../assets/image/no_main_img.svg';
import { toast } from 'react-toastify';
import { createNumberMask } from 'redux-form-input-masks';
import moment from 'moment';

const ProductInnerAdd = ({
  handleSubmit,
  categories,
  getCategories,
  getBrands,
  brands,
  deleteImage,
  addImage,
  editProductNew,
  history,
  addBrand,
  change,
  addProductNew,
  role,
}) => {
  useEffect(() => {
    getCategories();
    getBrands();
    change('code', 'Filled automatically.');
  }, []);

  const [description, setDescription] = useState('');

  const [mainImage, setMainImage] = useState(null);

  const submitForm = (data) => {
    const {
      name,
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

    if (!mainImage || (mainImage && !mainImage.file)) {
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
    pack_size && formData.append('pack_size', pack_size);
    expiration_date &&
      formData.append(
        'expiration_date',
        moment(expiration_date)
          .utcOffset(0)
          .format('YYYY-MM-DD'),
      );

    if (category) {
      formData.append('subcategory', category.id);
    }
    if (brand) {
      formData.append('brand', brand.id);
    }

    formData.append('financial_category', financial_category.value);

    if (mainImage) {
      formData.append('image', mainImage.file);
    }
    addProductNew(formData).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        images
          .filter((el) => el)
          .forEach((el) => {
            const formData = new FormData();
            formData.append('image', el.file);
            addImage(res.payload.data.id, formData);
          });
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
  const [images, setImages] = useState(['', '', '', '', '']);

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
        <div className="title_page">Create product</div>
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
                      required
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
                  {...currencyMask}
                  name="price"
                  placeholder="0"
                  component={RenderField}
                />
              </div>
              <div>
                <span>Cost</span>
                <Field
                  currency={'USD'}
                  {...currencyMask}
                  name="cost"
                  placeholder="0"
                  component={RenderField}
                />
              </div>
              <div>
                <span>Qty on hand</span>
                <Field type="number" name="on_hand" placeholder="0" component={RenderField} />
              </div>
              <div>
                <span>Reorder point</span>
                <Field type="number" name="reorder_point" placeholder="0" component={RenderField} />
              </div>

              <div>
                <span>Pack size</span>
                <Field type="text" name="pack_size" placeholder="Type..." component={RenderField} />
              </div>

              <div className="date-picker product-page">
                <span>Expiration date</span>
                <Field
                  className="calendar"
                  type="text"
                  name="expiration_date"
                  isExpiration
                  isClearable
                  component={renderDatePicker}
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
                {images.slice(0, 5).map((el, idx) =>
                  el ? (
                    <div key={idx}>
                      <img src={el.image} className="main-photo" />
                      <img
                        src={DeletePhoto}
                        className="delete-icon"
                        onClick={() => {
                          setImages([...images.slice(0, idx), '', ...images.slice(idx + 1)]);
                        }}
                      />
                    </div>
                  ) : (
                    <div key={idx}>
                      <label>
                        <img src={NoPhoto} className="main-photo" />
                        <input
                          type="file"
                          id="fileCreate"
                          style={{ display: 'none' }}
                          accept="image/jpg, image/jpeg, image/png"
                          onChange={(e) => {
                            let fileItem = e.target.files[0];
                            let image = URL.createObjectURL(fileItem);
                            if (fileItem) {
                              setImages([
                                {
                                  image,
                                  file: fileItem,
                                },
                                ...images.slice(0, 4),
                              ]);
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
                Create product
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
  if (!values.financial_category) {
    errors.financial_category = 'Required';
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

const ProductInnerAddForm = reduxForm({
  form: 'ProductInnerAdd',
  validate,
  // enableReinitialize: true,
})(ProductInnerAdd);

const mapStateToProps = ({ products, auth, dashboard }) => {
  return {
    categories: dashboard.categories,
    brands: products.brands,
    role: auth.data.role,
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
