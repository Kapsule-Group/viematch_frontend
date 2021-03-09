import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Navbar from './Navbar';
import Footer from './Footer';
import { listCategories, listBrands, listBrandsCategory } from '../../actions/storeAction';
import "./Listing.css";

class Listing extends Component {

  state = {
    cart: [],
    categoriesList: [],
    brandsList: [],
    productsList: []
  };

  componentDidMount() {
    this.listCategories();
    this.listBrands();

    const { match: { params } } = this.props;
    this.listProducts(params.type,params.value);

  }

  componentWillUnmount() {

  }

  listProducts = (type, values) => {
    const { listBrandsCategory } = this.props;

    listBrandsCategory(type, values).then(res => {
        if (res.payload && res.payload.status && res.payload.status === 200) {
            this.setState({
              productsList: res.payload.data
            })
        }
    })
  }



  listCategories = () => {
    const { listCategories } = this.props;

    listCategories().then(res => {
        if (res.payload && res.payload.status && res.payload.status === 200) {
            this.setState({
              categoriesList: res.payload.data
            })
        }
    })
  }


  listBrands = () => {
    const { listBrands } = this.props;

    listBrands().then(res => {
        if (res.payload && res.payload.status && res.payload.status === 200) {
            this.setState({
              brandsList: res.payload.data
            })
        }
    })
  }




    render() {
      const { match: { params } } = this.props;
      let { categoriesList, brandsList, productsList } =this.state;
        return (
  <div className="super_container">

<Navbar/>
<div className="home">
  <div className="home_background parallax-window" data-parallax="scroll" data-image-src="None" />
  <div className="home_overlay" />
  <div className="home_content d-flex flex-column align-items-center justify-content-center">
    <h2 className="home_title">{params.value}</h2>
  </div>
</div>




<div className="shop">
  <div className="container">
    <div className="row">
      <div className="col-lg-3">
        {/* Shop Sidebar */}
        <div className="shop_sidebar">
          <div className="sidebar_section">
            <div className="sidebar_title">Categories</div>
            <ul className="sidebar_categories">



            { categoriesList.map((key, index) => (
              <li>
                <a href={"store/category/"+key.name}>
                  { key.name }
                </a>
              </li>
              )) }


            </ul>
          </div>
          <div className="sidebar_section filter_by_section">
            <div className="sidebar_title">Filter By</div>
          </div>
          <div className="sidebar_section">
            <div className="sidebar_subtitle brands_subtitle">Brands</div>
            <ul className="brands_list">


            {brandsList.map((key, index) => (
              <li className="brand">
                <a href={"store/brand/"+key.name}>
                  {key.name}
                </a>
              </li>
            ))}

            </ul>
          </div>
        </div>
      </div>
      <div className="col-lg-9">
        {/* Shop Content */}
        <div className="shop_content">
          <div className="shop_bar clearfix">
            <div className="shop_product_count"><span>{productsList.length}</span> products found</div>
          </div>
          <div className="product_grid row">
            <div className="product_grid_border" />
            {/* Product Item */}


            { productsList.map((key, index) => (
            <div className="product_item col-md-2 m-0" style={{paddingLeft: '5px', paddingRight: '5px'}}>
              <div className="product_border" />
              <div className="product_image d-flex flex-column align-items-center justify-content-center">
                <a href={"store/product/"+key.id} tabIndex={0}>
                  <img src={key.image} style={{maxWidth: '115px', maxHeight: '150px'}} alt="Dycal" />
                </a>
              </div>
              <div className="product_content">
                <div className="product_name">
                  <div>
                    <a href={"store/product/"+key.id} className="text-wrap" tabIndex={0}>
                      {key.name}
                    </a>
                  </div>
                </div>
              </div>
              <div className="product_fav"><i className="fas fa-heart" /></div>
              <ul className="product_marks">
                <li className="product_mark product_discount">-25%</li>
                <li className="product_mark product_new">new</li>
              </ul>
            </div>
            ))}



            {/* Product Item */}


          </div>
          {/* Shop Page Navigation */}

        </div>
      </div>
    </div>
  </div>
</div>




    <Footer/>
      </div>
    );
}
}



function mapStateToProps(state) {
return {

}
}


function mapDispatchToProps(dispatch) {
return bindActionCreators({
  listCategories,
  listBrands,
  listBrandsCategory
}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Listing);
