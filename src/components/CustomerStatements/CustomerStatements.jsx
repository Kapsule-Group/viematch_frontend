import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import balance_down from '../../assets/image/balance_down.svg';
import balance_ok from '../../assets/image/balance_ok.svg';
import balance_up from '../../assets/image/balance_up.svg';
import mini_warning from '../../assets/image/mini_warning.svg';
import search from '../../assets/image/search.svg';
import Loader from '../HelperComponents/ContentLoader/ContentLoader';
import { useDebounce } from '../../helpers/functions';
import './CustomerStatements.scss';
import Pagination from '../HelperComponents/Pagination/Pagination';
import FormControl from '@material-ui/core/FormControl';
import SelectComponent from '../HelperComponents/SelectComponent/SelectComponent';
import { getRegions } from '../../actions/managersActions';
import { useSelector, useDispatch } from 'react-redux';
import { regionCustomerBalance, searchBalanceInfo } from '../../actions/customersActions';
import DialogComponent from '../HelperComponents/DialogComponent/DialogComponent';
import CalendarInput from '../HelperComponents/CalendarInput/CalendarInput';
import DatePicker from 'react-datepicker';
import RenderField, {
  ReduxFormSelect,
  RenderArea,
  renderDatePicker,
  renderDatePickerHours,
} from '../HelperComponents/RenderField/RenderField';
import { reduxForm, Field, FieldArray, formValueSelector, change } from 'redux-form';

const CustomerStatements = ({ handleSubmit }) => {
  const [activePage, setActivePage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const methods_list = [
    { label: 'Cash', value: 'cash' },
    { label: 'Check', value: 'check' },
    { label: 'Transfer', value: 'transfer' },
    { label: 'Mobile', value: 'mobile' },
  ];
  const dispatch = useDispatch();

  const { regionsList } = useSelector(({ managers }) => managers);
  const { regionsBalance, loading, searchList, total_pages, count, searchLoading } = useSelector(
    ({ customers }) => customers,
  );
  const { data } = useSelector(({ auth }) => auth);

  const [parameters, setParameters] = useState({
    page_size: 10,
    types: null,
  });

  const setPage = ({ selected }, isReload) => {
    setActivePage(selected);
    if (isReload) doRequest(selected);
  };

  const doRequest = (page) => {
    let url = [`page=${(page || page) + 1 || activePage + 1}`];
    for (let key in parameters) {
      if (parameters[key] !== null && parameters[key] !== '') {
        url.push(`${key}=${parameters[key].value ? parameters[key].value : parameters[key]}`);
      }
    }
  };

  const submitForm = (values) => {
    console.log(data);
  };

  const [renderQuntity, setRenderQuantity] = useState(0);

  const [searchParams, setSearchParams] = useState({
    page: 1,
    search: '',
    region: {
      value: null,
      label: 'All regions',
    },
  });

  useEffect(() => {
    doRequest();
  }, [parameters]);

  useEffect(() => {
    setPage({ selected: 0 }, true);
  }, [parameters]);

  useEffect(() => {
    dispatch(getRegions());
    dispatch(regionCustomerBalance(1));
  }, []);

  const debounced = useDebounce(searchParams);

  useEffect(() => {
    renderQuntity !== 0 &&
      dispatch(
        searchBalanceInfo(
          searchParams.page,
          searchParams.region.value !== null && searchParams.region.label,
          searchParams.search && searchParams.search,
        ),
      );
  }, [debounced]);

  return (
    <div className="customers_statements_page content_block">
      <div className="title_page">Customer statements</div>

      <div className="content_page">
        <div className="descriptions">total</div>
        <div className="total_table">
          <div className="table_container transactions_columns">
            <div className="table_header">
              <div className="table_row">
                <div className="row_item">Region</div>
                <div className="row_item">Sales</div>
                <div className="row_item">Paid</div>
                <div className="row_item">Balance due</div>
              </div>
            </div>
            <div className="table_body">
              {loading ? (
                <Loader />
              ) : (
                regionsBalance &&
                regionsBalance.balance_block &&
                regionsBalance.balance_block.map((item, idx) => (
                  <div className="table_row" key={idx}>
                    <div className="row_item">
                      <span>{item.region_name}</span>
                    </div>
                    <div className="row_item">
                      {new Intl.NumberFormat('en-US', {
                        tminimumFractionDigits: 0,
                      }).format(Number(item.total_sales).toFixed(0))}
                    </div>

                    <div className="row_item">
                      {new Intl.NumberFormat('en-US', {
                        tminimumFractionDigits: 0,
                      }).format(Number(item.total_paid).toFixed(0))}
                      <span
                        className={
                          item.total_paid === item.total_sales
                            ? 'ok'
                            : item.total_paid > item.total_sales
                            ? 'up'
                            : 'down'
                        }>
                        {(isNaN(+item.total_paid / +item.total_sales) || item.total_sales == 0
                          ? 0
                          : (+item.total_paid / +item.total_sales) * 100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="row_item">
                      <span>
                        {new Intl.NumberFormat('en-US', {
                          tminimumFractionDigits: 0,
                        }).format(Number(item.total_balance_due).toFixed(0))}{' '}
                        {item.currency}
                      </span>
                      <p>
                        {item.total_paid === item.total_sales ? (
                          <img src={balance_ok} alt="ok" />
                        ) : item.total_paid > item.total_sales ? (
                          <img src={balance_up} alt="up" />
                        ) : (
                          <img src={balance_down} alt="down" />
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="content_page">
        <div className="customers__header">
          <div className="descriptions">customers</div>
        </div>

        <div className="table_panel">
          <div className="search_block">
            <img src={search} alt="search" />
            <input
              className="search"
              type="text"
              placeholder="Search…"
              onChange={(e) => {
                setSearchParams({ ...searchParams, page: 1, search: e.target.value });
                setActivePage(0);
                setRenderQuantity(1);
              }}
            />
          </div>
          {data.role !== 'region' && data.role !== 'credit' && (
            <FormControl className="select_wrapper">
              <SelectComponent
                value={{
                  label: searchParams.region.label,
                  value: searchParams.region.value,
                }}
                options={[{ label: 'All regions', value: null }, ...regionsList]}
                change={(e) => {
                  setActivePage(0);
                  setRenderQuantity(1);
                  setSearchParams({
                    ...searchParams,
                    page: 1,
                    region: { label: e.label, value: e.value },
                  });
                }}
                isClearable={false}
                isSearchable={false}
                placeholder="Select…"
              />
            </FormControl>
          )}
        </div>

        <div className="customers_table">
          <div className="table_container transactions_columns">
            <div className="table_header">
              <div className="table_row">
                <div className="row_item">Name</div>
                <div className="row_item">Region</div>
                <div className="row_item">Sales</div>
                <div className="row_item">Paid</div>
                <div className="row_item">Balance due</div>
              </div>
            </div>
            <div className="table_body">
              {searchLoading ? (
                <Loader />
              ) : renderQuntity !== 0 ? (
                searchList.map((item, idx) => (
                  <div className="table_row" key={idx}>
                    <div className="row_item">
                      <Link to={`/main/customer-statements/${item.id}`}>{item.username}</Link>
                      {item.multi_currency_orders ? (
                        <div>
                          <img src={mini_warning} alt="mini_warning" />
                          <span>
                            The currency in some invoices differs from the currency of the region
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div className="row_item">
                      <span>{item.region_name === null ? 'Without region' : item.region_name}</span>
                    </div>
                    <div className="row_item">
                      {new Intl.NumberFormat('en-US', {
                        tminimumFractionDigits: 0,
                      }).format(Number(item.sales).toFixed(0))}
                    </div>
                    <div className="row_item ">
                      {new Intl.NumberFormat('en-US', {
                        tminimumFractionDigits: 0,
                      }).format(Number(item.paid).toFixed(0))}
                      <span
                        className={
                          item.paid === item.sales ? 'ok' : item.current_amount < 0 ? 'up' : 'down'
                        }>
                        {(isNaN(item.paid / item.sales) || item.sales == 0
                          ? 0
                          : (item.paid / item.sales) * 100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="row_item">
                      <span>
                        {new Intl.NumberFormat('en-US', {
                          tminimumFractionDigits: 0,
                        }).format(Number(item.balance_due).toFixed(0))}{' '}
                        {item.currency}
                      </span>
                      <p>
                        {item.paid === item.sales ? (
                          <img src={balance_ok} alt="ok" />
                        ) : item.current_amount < 0 ? (
                          <img src={balance_up} alt="up" />
                        ) : (
                          <img src={balance_down} alt="down" />
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                regionsBalance &&
                regionsBalance.results &&
                regionsBalance.results.map((item, idx) => (
                  <div className="table_row" key={idx}>
                    <div className="row_item">
                      <Link to={`/main/customer-statements/${item.id}`}>{item.username}</Link>
                      {item.multi_currency_orders ? (
                        <div>
                          <img src={mini_warning} alt="mini_warning" />
                          <span>
                            The currency in some invoices differs from the currency of the region
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div className="row_item">
                      <span>{item.region_name === null ? 'Without region' : item.region_name}</span>
                    </div>
                    <div className="row_item">
                      {new Intl.NumberFormat('en-US', {
                        tminimumFractionDigits: 0,
                      }).format(Number(item.sales).toFixed(0))}
                    </div>
                    <div className="row_item ">
                      {new Intl.NumberFormat('en-US', {
                        tminimumFractionDigits: 0,
                      }).format(Number(item.paid).toFixed(0))}
                      <span
                        className={
                          item.paid === item.sales ? 'ok' : item.current_amount < 0 ? 'up' : 'down'
                        }>
                        {(isNaN(item.paid / item.sales) || item.sales == 0
                          ? 0
                          : (item.paid / item.sales) * 100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="row_item">
                      <span>
                        {new Intl.NumberFormat('en-US', {
                          tminimumFractionDigits: 0,
                        }).format(Number(item.balance_due).toFixed(0))}{' '}
                        {item.currency}
                      </span>
                      <p>
                        {item.paid === item.sales ? (
                          <img src={balance_ok} alt="ok" />
                        ) : item.current_amount < 0 ? (
                          <img src={balance_up} alt="up" />
                        ) : (
                          <img src={balance_down} alt="down" />
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {regionsBalance.count > 10 && (
          <div className="pagination_info_wrapper">
            <div className="pagination_block">
              <Pagination
                active={activePage}
                pageCount={
                  renderQuntity === 0 ? regionsBalance && regionsBalance.total_pages : total_pages
                }
                onChange={(page) => {
                  setPage(page, true);
                  setRenderQuantity(1);
                  setSearchParams({ ...searchParams, page: page.selected + 1 });
                }}
              />
            </div>
            <div className="info">
              Displaying page {activePage + 1} of{' '}
              {renderQuntity === 0 ? regionsBalance && regionsBalance.total_pages : total_pages},
              items {(activePage + 1) * 10 - 9} to{' '}
              {(activePage + 1) * 10 > (renderQuntity === 0 ? regionsBalance.count : count)
                ? renderQuntity === 0
                  ? regionsBalance.count
                  : count
                : (activePage + 1) * 10}{' '}
              of {renderQuntity === 0 ? regionsBalance.count : count}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const selector = formValueSelector('AddRegion');

export default CustomerStatements;
