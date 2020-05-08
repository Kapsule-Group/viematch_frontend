import React, { Fragment, Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Pagination from '../HelperComponents/Pagination/Pagination';
import ok from '../../assets/image/ok.svg';
import no from '../../assets/image/no.svg';
import minus from '../../assets/image/minus.svg';
import plus from '../../assets/image/plus.svg';
import roll_down from '../../assets/image/roll_down.svg';
import sort_up from '../../assets/image/sort_up.svg';
import sort_down from '../../assets/image/sort_down.svg';
import './StockManagement.scss';
import QuantityDialog from './Dialogs/QuantityDialog';
import RequestDialog from './Dialogs/RequestDialog';
import { getStock, searchStock, getSearchList } from '../../actions/stockActions';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';


class StockManagement extends Component {
    state = {
        loading: true,
        tab: "0",
        stock: 'in',
        activePage: 0,
        totalPages: '',
        totalItems: '',
        InfoIsOpen: false,
        openQuantityDialog:false,
        openRequestDialog: false,
        sign: null,
        product_name: null,
        product_quantity: null,
        openSearch: false,
        optionValue: null,
        switcherState: 'quantity',
        someVal: '',
        newVal: ''
    };

    componentDidMount() {
        this.setState({role: localStorage.getItem('role')});
        if (this.props.location.state){
            this.setState({
                tab: this.props.location.state.tab.toString(),
            });
            this.props.location.state.tab === 1 && this.setState({ stock: 'out' });
        }

        this.timer = this.timeout = setTimeout(() => {
            this.doRequest();
        }, 0);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    doRequest = (page) => {
        const { getStock } = this.props;
        const { stock, switcherState } = this.state;
        getStock(stock, page !== undefined ? page.selected + 1 : false, switcherState).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                if (page !== undefined) {
                    this.setState({
                        loading: false,
                        activePage: page.selected,
                        totalPages: res.payload.data.total_pages,
                        totalItems: res.payload.data.count
                    })
                } else {
                    this.setState({
                        loading: false,
                        totalPages: res.payload.data.total_pages,
                        totalItems: res.payload.data.count,
                        activePage: (page ? page : 0),
                    })
                }
            }
        })
    };

    handleSwitch = () => {
        if(this.state.switcherState === 'quantity'){
            this.setState({
                switcherState: '-quantity',
            })

        }else {
            this.setState({
                switcherState: 'quantity',
            });
        }
        this.timer = this.timeout = setTimeout(() => {
            this.doRequest();
        }, 0);
    };

    toggleQuantityDialog = (sign, name, quantity, id) => {
        this.setState(({openQuantityDialog}) => ({
            openQuantityDialog: !openQuantityDialog,
            sign: typeof(sign) === 'string' ? sign : '',
            product_name: name,
            product_quantity: quantity,
            product_id: id,
            InfoIsOpen: false,
        }));
    };
    toggleRequestDialog = (name, quantity, id) => {
        this.setState(({openRequestDialog}) => ({
            openRequestDialog: !openRequestDialog,
            product_name: typeof(name) === 'string' ? name : '',
            product_quantity: quantity,
            product_id: id,
            InfoIsOpen: false,
        }));
    };

    changeTab = (tab, stock) => {
        const { getStock } = this.props;
        this.setState({ tab, stock });
        getStock(stock).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({
                    loading: false,
                    activePage: 0,
                    totalPages: res.payload.data.total_pages,
                    totalItems: res.payload.data.count
                });
                this.pagFunc();
            }
        })
    };

    openMenu = (id) => {
        this.setState(({InfoIsOpen}) => ({
            InfoIsOpen: true,
            product_id: id,
        }))
    };

    closeMenu = (id) => {
        this.setState(({InfoIsOpen}) => ({
            InfoIsOpen: false,
            product_id: '',
        }))
    };

    toggleSearch = () => {
        this.setState(({openSearch}) => ({
            openSearch: !openSearch
        }));
    };

    togglePopper = () => {
        this.setState({openSearch: true, activePage: 0 });
    };

    handleToggleSearch = () => {
        this.setState({
            openSearch: false
        })
    };

    searchOnChange = (e) => {
        let regEx = /[^a-zA-Zа-яА-Я0-9]/g;

        this.setState({
            someVal: e.target.value.replace(regEx, ''),
            newVal: e.target.value.replace(regEx, '')
        })
    };


    handleSearchChange = (e) => {
        const { searchStock, search_list, getSearchList } = this.props;
        const { stock } = this.state;
        let inputValue = e.target.value.replace('#', '');



        if(inputValue.length >= 3){
            searchStock(stock, inputValue).then(res => {
                if(res.payload && res.payload.status && res.payload.status === 200){
                    this.togglePopper();
                }
            })
        }else if(inputValue.length < 3){
            this.setState({openSearch: false});
            if (inputValue.length === 0) {

                this.doRequest();
            }
        }

        if(e.keyCode === 13 && inputValue.length > 2) {
            let el_id = search_list.map(el => el.id);
            getSearchList(el_id.join(',')).then(res => {
                if(res.payload && res.payload.status && res.payload.status === 200){
                    this.setState({
                        totalPages: res.payload.data.total_pages,
                        totalItems: res.payload.data.count});
                    this.handleToggleSearch();
                }
            })
        }else if(e.keyCode === 13 && inputValue.length < 2){
            return null
        }

    };
    handleSearchClick = (id) => {
        const { getSearchList } = this.props;
        getSearchList(id).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200){
                this.setState({
                    totalPages: res.payload.data.total_pages,
                    totalItems: res.payload.data.count});
                this.handleToggleSearch();
            }
        })
    };

    pagFunc = (page) => {
        this.doRequest(page)
    };


    render(){

        const {
            tab,
            activePage,
            InfoIsOpen,
            openQuantityDialog,
            openRequestDialog,
            loading,
            sign,
            product_name,
            product_quantity,
            product_id,
            openSearch,
            totalPages,
            totalItems,
            role,
            stock,
            newVal
        } = this.state;
        const {stock_list, search_list} = this.props;
        if(loading) return null;
        return (
            <div className="stock_management_page content_block">
                <div className="title_page">Stock management</div>

                <div className="content_page">
                    <div className="tab_block">
                        <button
                            className={tab === "0" ? "active" : ""}
                            onClick={() => this.changeTab("0", "in")}
                        >
                            in stock
                        </button>
                        <button
                            className={tab === "1" ? "active" : ""}
                            onClick={() => this.changeTab("1", "out")}
                        >
                            out of stock
                        </button>
                    </div>
                    {totalItems > 0 ? <Fragment>

                        <ClickAwayListener onClickAway={this.handleToggleSearch}>
                            <div className="block_search">
                                <input
                                    onKeyUp={(e) => this.handleSearchChange(e)}
                                    onChange={this.searchOnChange}
                                    value={newVal}
                                    type="text"
                                    placeholder="Search…"
                                />
                                {openSearch ?
                                    <div className="autocomplete">
                                        {!!search_list && search_list[0] ?
                                            search_list.map((el, idx) => (
                                                <button onClick={() => this.handleSearchClick(el.id)} className='search_item' key={idx}>{el.product_name}</button>
                                            )) : <button disabled>No items</button> }
                                    </div>
                                    : null}
                            </div>
                        </ClickAwayListener>


                        {tab === "0" &&
                        <div className="in_stock_wrapper">
                            <div className="in_stock_table">
                                <div className="table_container transactions_columns">
                                    <div className="table_header">
                                        <div className="table_row">
                                            <div className="row">
                                                <div className="row_item">Name</div>
                                                <div className="row_item">Code</div>
                                                <div className="row_item">
                                                    <button onClick={this.handleSwitch} className="btn_sort">
                                                        Quantity
                                                        <div className="sort">
                                                            <img src={sort_up} alt="sort_up"/>
                                                            <img src={sort_down} alt="sort_down"/>
                                                        </div>
                                                    </button>
                                                </div>
                                                <div className="row_item">Unit value</div>
                                                <div className="row_item">Total value</div>
                                                <div className="row_item">Actions</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table_body">
                                        {stock_list.results.map((row, idx) => (
                                            <div className="table_row" key={idx}>
                                                <div className="row">
                                                    <div className="row_item">{row.product_name}</div>
                                                    {row.code ?
                                                        <div className="row_item">#{row.code}</div> :
                                                        <div className="row_item">-</div>}
                                                    <div className="row_item">
                                                        <button disabled={row.quantity <= 0}
                                                                onClick={() => this.toggleQuantityDialog('-', row.product_name, row.quantity, row.id)}>
                                                            <img src={minus} alt="minus"/>
                                                        </button>
                                                        <div>{row.quantity}</div>
                                                        <button onClick={() => this.toggleQuantityDialog('+', row.product_name, row.quantity, row.id)}>
                                                            <img src={plus} alt="plus"/>
                                                        </button>
                                                    </div>
                                                    <div className="row_item">RWF{row.price}</div>

                                                    <div className="row_item">RWF{row.total_price}</div>
                                                    <div className="row_item">
                                                        {row.deleted && row.code ? <div className="btn_text">Not available</div> :
                                                            row.code ?
                                                                <div className="row_item">
                                                                    <button className={role !== "user" ? "green_text btn_text" : "hided"} disabled={role === 'user'} onClick={() => this.toggleRequestDialog(row.product_name, row.quantity, row.id)}>
                                                                        REQUEST SUPPLY
                                                                    </button>
                                                                </div>
                                                                :  <div className="row_item">-</div>}
                                                        <button
                                                            className={InfoIsOpen && product_id === row.id ? "btn_arrow_open btn_arrow" : "btn_arrow"}
                                                            onClick={() => product_id === row.id ? this.closeMenu(row.id) : this.openMenu(row.id)}><img src={roll_down} alt="roll_down"/>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className={InfoIsOpen && product_id === row.id ? "info info_open" : "info"}>
                                                    <div className="row_item">
                                                        <span>Category</span>
                                                        {role !== 'user' ? <Link className={role !== "user" ? "" : "hided"} to={`/main/catalog/category/${row.product_subcategory[0][row.product_subcategory[0].length-1].id}`}>{row.product_subcategory[1]}</Link>
                                                            : <a className='hided'>{row.product_subcategory[1]}</a> }
                                                    </div>
                                                    <div className="row_item">
                                                        <span>Auto supply</span>
                                                        {row.auto_supply ?
                                                            <img src={ok} alt="ok"/> :
                                                            <img src={no} alt="no"/>
                                                        }
                                                    </div>
                                                    <div className="row_item">
                                                        <span>Min. qty</span>
                                                        {row.deleted ? '-' : row.min_supply_quantity}
                                                    </div>
                                                    <div className="row_item">
                                                        <span>Auto supply qty</span>
                                                        {row.deleted ? '-' : row.supply_quantity}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {totalItems < 10 ? null :
                                    <div className="pagination_info_wrapper">
                                        <div className="pagination_block">
                                            <Pagination
                                                active={activePage}
                                                pageCount={+totalPages}
                                                onChange={this.pagFunc}
                                            />
                                        </div>
                                        <div className="info">Displaying page {activePage+1} of {totalPages},
                                            items {(activePage + 1) * 10 - 9} to {(activePage + 1) * 10 > totalItems ? totalItems : (activePage + 1) * 10} of {totalItems}</div>
                                    </div>
                                }
                            </div>

                        </div>
                        }
                        {tab === "1" &&
                        <div className="out_of_stock_table">
                            <div className="table_container transactions_columns">
                                <div className="table_header">
                                    <div className="table_row">
                                        <div className="row_item">Name</div>
                                        <div className="row_item">Category</div>
                                        <div className="row_item">Code</div>
                                        <div className="row_item">
                                            <button className="btn_sort stub">
                                                Quantity
                                                <div className="sort">
                                                    {/*<img src={sort_up} alt="sort_up"/>*/}
                                                    {/*<img src={sort_down} alt="sort_down"/>*/}
                                                </div>
                                            </button>
                                        </div>
                                        <div className="row_item">Unit value</div>
                                        <div className="row_item">Actions</div>
                                    </div>
                                </div>
                                <div className="table_body">
                                    {stock_list.results.map((row, idx) => (
                                        <div className="table_row" key={idx}>
                                            <div className="row_item">{row.product_name}</div>
                                            <div className="row_item">
                                                {role !== 'user' ? <Link className={role !== "user" ? "" : "hided"} to={`/main/catalog/category/${row.product_subcategory[0][row.product_subcategory[0].length-1].id}`}>{row.product_subcategory[1]}</Link>
                                                    : <a className='hided'>{row.product_subcategory[1]}</a> }
                                            </div>
                                            {row.code ?
                                                <div className="row_item">#{row.code}</div> :
                                                <div className="row_item">-</div>}
                                            <div className="row_item">
                                                <button disabled={row.quantity <= 0} onClick={() => this.toggleQuantityDialog('-', row.product_name, row.quantity, row.id)}>
                                                    <img style={{opacity:'.4'}} src={minus} alt="minus"/>
                                                </button>
                                                <div>{row.quantity}</div>
                                                <button onClick={() => this.toggleQuantityDialog('+', row.product_name, row.quantity, row.id, row.id)}>
                                                    <img src={plus} alt="plus"/>
                                                </button>
                                            </div>
                                            <div className="row_item">RWF{row.price}</div>
                                            {row.code ?
                                                <div className="row_item">
                                                    <button className={role !== "user" ? "green_text btn_text" : "hided"} disabled={role === 'user'} onClick={() => this.toggleRequestDialog(row.product_name, row.quantity, row.id)}>
                                                        Request supply
                                                    </button>
                                                </div>
                                                :  <div className="row_item">-</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {totalItems < 10 ? null :
                                <div className="pagination_info_wrapper">
                                    <div className="pagination_block">
                                        <Pagination
                                            active={activePage}
                                            pageCount={+totalPages}
                                            onChange={this.doRequest}
                                        />
                                    </div>
                                    <div className="info">Displaying page {activePage+1} of {totalPages},
                                        items {(activePage + 1) * 10 - 9} to {(activePage + 1) * 10 > totalItems ? totalItems : (activePage + 1) * 10} of {totalItems}</div>
                                </div>
                            }
                        </div>
                        }
                    </Fragment>: <h3 className={'empty_list'}>The list is empty</h3>}
                </div>

                <QuantityDialog toggler={this.toggleQuantityDialog}
                                product_quantity={product_quantity}
                                product_name={product_name}
                                sign={sign}
                                state={openQuantityDialog}
                                product_id={product_id}
                                startValue={''}
                                activePage={activePage}
                                doRequest={this.doRequest}
                />
                <RequestDialog toggler={this.toggleRequestDialog}
                               product_quantity={product_quantity}
                               product_name={product_name}
                               state={openRequestDialog}
                               product_id={product_id}
                               startValue={''}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return{
        stock_list: state.stock.stock_list,
        search_list: state.stock.search_list,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getStock,
        searchStock,
        getSearchList,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StockManagement);
