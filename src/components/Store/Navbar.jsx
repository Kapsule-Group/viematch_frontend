import React, { Component } from 'react';
import { listCategories, storeSearch, addToCart, removeFromCart } from '../../actions/storeAction';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
class Navbar extends React.Component {

  constructor(){
          super();
          this.state = {
             categores: 'hidden',
             cartValue: 0,
             categoriesList: [],
             newVal: '',
             products: []
          }
      }
  componentDidMount() {
    let products = [];
    if(localStorage.getItem('products')){
        products = JSON.parse(localStorage.getItem('products'));
    }
    this.setState({
      cartValue: products.length
    })

    this.listCategories();

  }

  componentWillUnmount() {

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


  selectCateg =(e) => {
      this.setState({
          selectType: e.target.value,
      })
  }


  handleSearchChange = (e) => {
      const { storeSearch } = this.props;
      let inputValue = this.state.newVal;
      if (inputValue.length > 2) {
        storeSearch(inputValue, '').then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                  products: res.payload.data
                })
            }
        })


      }else{
        this.setState({
          products: []
        })
      }

  };
  searchOnChange = (e) => {
      let regEx = /[^a-zA-Zа-яА-Я0-9\s]/g;

      this.setState({
          newVal: e.target.value.replace(regEx, '')
      })
  };


  addToCart = (productId, name, image) => {
    let products = [];
    if(localStorage.getItem('products')){
        products = JSON.parse(localStorage.getItem('products'));
    }

    let id = products.filter(product => product.productId === productId);
    if(id.length < 1){
      products.push({'productId' : productId, 'image' : image, 'name': name});
    }
    localStorage.setItem('products', JSON.stringify(products));

    }



showMsg = () => {
  alert("mssage from navbar");
}


showCategories = () => {

  this.setState({
    categores: this.state.categores === 'visible' ? 'hidden' : 'visible'
  })
}

  render() {


    const { items } = this.props;
    console.log(this.props);



    let { categoriesList, products } = this.state;

return (

<div>
  <header className="header">

     <div className="top_bar">
     <div className="container">
     <div className="row" style={{ marginTop: '-8px' }}>
      <div className="col d-flex flex-row">
        <div className="top_bar_contact_item">
          <div className="top_bar_icon"><img src="http://139.59.152.214:2992/static/build/images/phone.7edb16f99199cfb9fc062ba7cd4105e2.png" alt="" /></div>
          +250 787 104 894
        </div>
        <div className="top_bar_contact_item">
          <div className="top_bar_icon"><img src="http://139.59.152.214:2992/static/build/images/mail.123246836508ffd85418db180d31fbec.png" alt="" /></div>
          <a href="mailto:fastsales@gmail.com">office@viebeg.com</a></div>
        <div className="top_bar_content ml-auto">
          <div className="top_bar_user">
            <div className="user_icon"><img src="http://139.59.152.214:2992/static/build/images/user.b5bdec384be154d119d2101831efea68.svg" alt="" />
            </div>
            <div><a href="/register">Register</a></div>
            <div><a href="/login">Sign in</a></div>
          </div>
        </div>
      </div>
     </div>
     </div>
     </div>
     {/* Header Main */}
     <div className="header_main">
     <div className="container" style={{ height: '180px' }}>
     <div className="row">
      {/* Logo */}
      <div className="col-lg-2 col-sm-3 col-3 order-1">
        <div className="logo_container">
          <div className="logo"><a href="/store">
              <img src="images/logo_viebeg.png" className="mt-2" alt="VieBeg" width="200px" />
            </a></div>
        </div>
      </div>
      {/* Search */}
      <div className="col-lg-8 col-12 order-lg-2 order-3 text-lg-left text-right">
        <div className="header_search">
          <div className="header_search_content">
            <div className="header_search_form_container">
              <form action="/search" className="header_search_form clearfix">
                <input type="text" required="required" name="q" className="header_search_input"
                onKeyUp={(e) => this.handleSearchChange(e)}
                value={this.state.newVal}
                onChange={this.searchOnChange} placeholder="Search for products..." />
                <div className="custom_dropdown">
                  <div className="custom_dropdown_list">
                    <span className="custom_dropdown_placeholder clc">All Categories</span>
                    <i className="fas fa-chevron-down" />
                    <ul className="custom_list clc">
                      <li><a className="clc" href="#">All Categories</a></li>

                      {categoriesList.map((key, index) => (
                      <li>
                        <a className="clc" style={{cursor: 'pointer'}}>
                          {key.name}
                        </a>
                      </li>
                      ))}

                    </ul>
                  </div>
                </div>
                <button type="submit" className="header_search_button trans_300" value="Submit">
                  <img src="/images/search.png" alt="" /></button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-2 col-9 order-lg-3 order-2 text-lg-left text-right">
        <div className="wishlist_cart d-flex flex-row align-items-center justify-content-end">
          {/* Cart */}
          <div className="cart">
            <div className="cart_container d-flex flex-row align-items-center justify-content-end">
              <div className="cart_icon">
                <a href="/cart" style={{textDecoration: 'none'}}>
                  <img src="/images/cart.png" alt="" />
                  <div className="cart_count"><span>0</span></div>
                </a>
              </div>
              <div className="cart_content">
                <a href="/store/shopping-cart" style={{textDecoration: 'none'}}>
                  <div className="cart_text">Cart</div>
                  <div className="cart_price"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
     </div>
     </div>
     {/* Main Navigation */}
     <nav className="main_nav" style={{ height: '60px' }}>
     <div className="container">
     <div className="row">
      <div className="col">
        <div className="main_nav_content d-flex flex-row">
          {/* Categories Menu */}
          <div className="cat_menu_container" onClick={()  =>this.showCategories() } style={{ marginTop: '-10px' }}>
            <div className="cat_menu_title d-flex flex-row align-items-center justify-content-start">
              <div className="cat_burger"><span /><span /><span /></div>
              <div className="cat_menu_text">categories</div>
            </div>
            <ul className="cat_menu" style={{ visibility: this.state.categores }}>
            {categoriesList.map((key, index) => (
              <li>
                <a href={"/store/category/"+key.name}>
                  {key.name}
                </a>
              </li>
            ))}
            </ul>
          </div>

          <div class="main_nav_menu ml-auto">
             <ul class="standard_dropdown main_nav_dropdown" style={{ marginTop: '-10px' }}>
                 <li>
                     <a href="/store">
                         Home
                     </a>
                 </li>
                 <li>
                     <a href="https://viebeg.health.blog" target="_blank">
                         Blog <i class="fas fa-chevron-down"></i>
                     </a>
                 </li>
                 <li>
                     <a href="http://www.viebeg.com/contact/" target="_blank">
                         Contact <i class="fas fa-chevron-down"></i>
                     </a>
                 </li>
             </ul>
         </div>


          {/* Menu Trigger */}
          <div className="menu_trigger_container ml-auto">
            <div className="menu_trigger d-flex flex-row align-items-center justify-content-end">
              <div className="menu_burger">
                <div className="menu_trigger_text">menu</div>
                <div className="cat_burger menu_burger_inner">
                  <span /><span /><span /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
     </div>
     </nav>
     {/* Menu */}
     <div className="page_menu">
     <div className="container">
     <div className="row">
      <div className="col">
        <div className="page_menu_content">
          <div className="page_menu_search">
            <form action="/search">
              <input type="search" required="required" className="page_menu_search_input" name="q" placeholder="Search for products..." />
            </form>
          </div>
          <ul className="page_menu_nav">
            <li className="page_menu_item">
              <a href="/">
                Home <i className="fa fa-angle-down" />
              </a>
            </li>
            <li className="page_menu_item">
              <a href="https://viebeg.health.blog">
                blog <i className="fa fa-angle-down" />
              </a>
            </li>
            <li className="page_menu_item">
              <a href="http://www.viebeg.com/contact/">
                contact <i className="fa fa-angle-down" />
              </a>
            </li>
          </ul>
          <div className="menu_contact">
            <div className="menu_contact_item">
              <div className="menu_contact_icon"><img src="http://139.59.152.214:2992/static/build/images/phone_white.1f8689bfc9efd3ab30751b28290809d0.png" alt="" /></div>
              +38 068 005 3570
            </div>
            <div className="menu_contact_item">
              <div className="menu_contact_icon"><img src="http://139.59.152.214:2992/static/build/images/mail_white.6d85832e5636963d7141922771d56ae4.png" alt="" /></div>
              <a href="mailto:fastsales@gmail.com">fastsales@gmail.com</a></div>
          </div>
        </div>
      </div>
     </div>
     </div>
     </div>
     </header>



{ products.length > 0 ?
     <div className="shop">
   <div className="container">
     <div className="row">
       <div className="col-lg-12">
         {/* Shop Content */}
         <div className="shop_content">
           <div className="shop_bar clearfix">

           </div>
           <div className="product_grid row">
             <div className="product_grid_border" />
             {/* Product Item */}


             { products.map((key, index) => (
             <div className="product_item col-md-2 m-0" style={{paddingLeft: '5px', paddingRight: '5px'}}>
               <div className="product_border" />
               <div className="product_image d-flex flex-column align-items-center justify-content-center">
                 <a href="/product/ligature-ties-color-light-pink" tabIndex={0}>
                   <img src={key.image} style={{maxWidth: '115px', maxHeight: '150px'}} alt="Ligature ties- color light pink" />
                 </a>
               </div>
               <div className="product_content">
                 <div className="product_name">
                   <div>
                     <a href="/product/ligature-ties-color-light-pink" className="text-wrap" tabIndex={0}>
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

: '' }

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
    storeSearch,
    addToCart,
     removeFromCart,
     
  }, dispatch);
  }

  export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
