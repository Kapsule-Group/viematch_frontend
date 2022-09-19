import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Path from '../../assets/image/Path.svg';
import { getSales, getSalesOrders } from './../../actions/managersActions';
import Pagination from '../HelperComponents/Pagination/Pagination';
import FormControl from '@material-ui/core/FormControl';
import SelectComponent from '../HelperComponents/SelectComponent/SelectComponent';
import moment from 'moment';
import no_actions from '../../assets/image/no_actions.svg';
import no_ok from '../../assets/image/no-ok.svg';
import new_icon from '../../assets/image/new_icon.svg';
import no_partial from '../../assets/image/no-partial.svg';
import PrintSVG from '../../assets/image/print.svg';
import ReactTooltip from 'react-tooltip';
import Upload from '../../assets/image/upload.svg';
import Download from '../../assets/image/download.svg';
import { changeOrder, partialChangeOrder } from '../../actions/ordersActions';
import { getActivityOrder } from '../../actions/invoiceActions';
import jsPDF from 'jspdf';
import { data_image } from '../Orders/OrdersInner/imagedata';
import './RegionalManagers.scss';

const InnerSales = ({
  managers,
  getSales,
  match: {
    params: { id },
  },
  getSalesOrders,
  changeOrder,
  partialChangeOrder,
  data,
  getActivityOrder,
}) => {
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState(null);
  const [activePage, setActivePage] = useState(1);

  const status_list = [
    { label: 'Request', value: 'request' },
    { label: 'Reviewing by Sales Rep.', value: 'sales_review' },
    { label: 'Rejected', value: 'sales_rejected' },
    { label: 'Waiting for approval', value: 'sales_to_approve' },
    { label: 'Proforma', value: 'proforma' },
    { label: 'Purchase Order', value: 'order' },
    { label: 'Delivery in progress', value: 'delivery' },
    { label: 'P.O. delivered', value: 'delivered' },
    { label: 'Invoice', value: 'invoice' },
    { label: 'Receipt', value: 'receipt' },
  ];
  const namesOfStatuses = {
    all: 'All',
    request: 'Request',
    proforma: 'Proforma',
    order: 'Purchase order',
    delivery: 'Delivery in progress',
    delivered: 'P.O. delivered',
    invoice: 'Invoice',
    receipt: 'Receipt',
    sales_to_approve: 'Request',
    sales_review: 'Request',
    sales_rejected: 'Request',
  };

  useEffect(() => {
    getSales();
    getSalesOrders(id);
  }, []);

  useEffect(() => {
    getSalesOrders(id, 1, search, activeStatus ? activeStatus.value : null);
  }, [activeStatus]);
  const currentManager = managers && managers.find((el) => el.id == id);

  const changePage = (e) => {
    getSalesOrders(id, e.selected + 1, search, activeStatus && activeStatus.value);
    setActivePage(e.selected + 1);
  };

  const returnStatusName = (status) => {
    switch (status) {
      case 'delivered':
        return 'P.O. delivered';
      case 'delivery':
        return 'Delivery note';
      case 'receipt':
        return 'Receipt';
      case 'order':
        return 'Purchase Order';
      case 'proforma':
        return 'Proforma';
      case 'request':
      case 'sales_to_approve':
      case 'sales_review':
      case 'sales_rejected':
        return 'Request';
      case 'invoice':
        return 'Invoice';

      default:
        return null;
    }
  };

  const GetCurrOrder = (id) => {
    getActivityOrder(id).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        generatePDF(res.payload.data);
      }
    });
  };

  const generatePDF = (client_data) => {
    var doc = new jsPDF('p', 'pt');
    let imageData = data_image;
    const pdfdat1 = client_data.items;
    const pdfdata = pdfdat1.map((elt) => [
      { content: elt.product_name, styles: { fontStyle: 'bold' } },
      { content: elt.quantity, styles: { halign: 'right' } },
      {
        content: Number(elt.price_per_unit).toFixed(2),
        styles: { halign: 'right' },
      },
      {
        content: Number(+elt.quantity * +elt.price_per_unit).toFixed(2),
        styles: { halign: 'right' },
      },
    ]);
    doc.addImage(imageData, 'PNG', 30, 60, 160, 50);
    const reducer = (accumulator, currentValue) => Number(accumulator) + Number(currentValue);
    var total = [];

    var z = 0;
    pdfdata.forEach((element) => total.splice(z, 0, Number(element[3]).toFixed(2)));
    ++z;
    var total1 = total.reduce(reducer, 0);
    doc.setFont('Helvetica');
    doc.setTextColor('#204569');
    doc.setFontSize(8);
    doc.setFontType('bold');
    doc.text(250, 70, 'Viebeg Medical and Dental Supplies Ltd');
    doc.setFontType('normal');
    client_data.region.address1 && doc.text(250, 85, client_data.region.address1);
    client_data.region.address2 && doc.text(250, 100, client_data.region.address2);
    client_data.region.address3 && doc.text(250, 115, client_data.region.address3);
    client_data.region.address4 && doc.text(250, 130, client_data.region.address4);
    client_data.region.address5 && doc.text(250, 145, client_data.region.address5);
    client_data.region.address6 && doc.text(250, 160, client_data.region.address6);
    client_data.region.address7 && doc.text(250, 175, client_data.region.address7);
    client_data.region.address8 && doc.text(250, 190, client_data.region.address8);
    doc.setFontSize(10);
    var pdfbody = [
      [
        {
          content: `${
            client_data.status === 'delivered'
              ? 'Delivery Note'
              : namesOfStatuses[client_data.status].toUpperCase()
          }`,
          colSpan: 4,
          styles: {
            halign: 'left',
            fontSize: 20,
            fontStyle: 'light',
            textColor: '#204569',
          },
        },
      ],
      [
        {
          content: `BILL TO`,
          colSpan: 2,
          rowSpan: 1,
          styles: {
            fontSize: 10,
            fontStyle: 'bold',
            valign: 'bottom',
          },
        },
        {
          content: `Invoice no.\r\nDate\r\nDue Date\r\nTerms`.toUpperCase(),
          colSpan: 1,
          rowSpan: 2,
          styles: {
            fontSize: 10,
            halign: 'right',
            fontStyle: 'bold',
          },
        },
        {
          content:
            `${client_data.request}` +
            `\r\n${moment(client_data.date).format('MM/DD/YYYY')}` +
            `\r\n${
              client_data.due_date === null
                ? '—'
                : moment(client_data.due_date).format('MM/DD/YYYY')
            }` +
            `\r\nNet 30`,
          colSpan: 1,
          rowSpan: 2,
          styles: { fontSize: 10 },
        },
      ],
      [
        {
          content: client_data.customer_name.toUpperCase(),
          colSpan: 2,
          rowSpan: 1,
          styles: { fontSize: 10, valign: 'top' },
        },
        '',
        '',
      ],
      [
        {
          content: '———————————————————————————————————————————————————',
          colSpan: 4,
          styles: {
            valign: 'middle',
            halign: 'center',
            cellPadding: 0,
            textColor: '#e3e7ec',
            fontStyle: 'bold',
            minCellHeight: 20,
          },
        },
      ],
      [
        { content: '', styles: { fillColor: '#EBF4FE' } },
        {
          content: 'QTY',
          styles: { fillColor: '#EBF4FE', halign: 'right' },
        },
        {
          content: 'RATE',
          styles: { fillColor: '#EBF4FE', halign: 'right' },
        },
        {
          content: 'AMOUNT',
          styles: { fillColor: '#EBF4FE', halign: 'right' },
        },
      ],
      [
        {
          content:
            '—  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —',
          colSpan: 4,
          styles: {
            valign: 'middle',
            halign: 'center',
            cellPadding: 0,
            textColor: '#e3e7ec',
            fontStyle: 'bold',
            minCellHeight: 20,
          },
        },
      ],
      [
        {
          content:
            `${client_data.region.bank_info1 && client_data.region.bank_info1}` +
            `\r\n${client_data.region.bank_info2 && client_data.region.bank_info2}` +
            `\r\n${client_data.region.bank_info3 && client_data.region.bank_info3}` +
            `\r\n${client_data.region.bank_info4 && client_data.region.bank_info4}` +
            `\r\nPayment upon delivery` +
            `\r\nDelivery: Immediately` +
            `\r\nGoods installed and commisioned`,
          colSpan: 2,
          rowSpan: 2,
          styles: { halign: 'left', fontSize: 8 },
        },
        {
          content: 'PAYMENT',
          rowSpan: 1,
          styles: { valign: 'bottom' },
        },
        {
          content: Number(client_data.total).toFixed(2),
          rowSpan: 1,
          styles: { valign: 'bottom', halign: 'right' },
        },
      ],
      [
        {
          content: 'BALANCE DUE',
          rowSpan: 1,
          styles: { valign: 'middle' },
        },
        {
          content: `${
            client_data.balance !== null
              ? `${client_data && client_data.currency}${client_data.balance}`
              : '—'
          }`,
          rowSpan: 1,
          styles: {
            valign: 'top',
            fontSize: 20,
            fontStyle: 'bold',
            halign: 'right',
          },
        },
      ],
      //margin
      [{ content: ``, colSpan: 4, styles: { minCellHeight: 20 } }],
      [
        {
          content:
            `Prepared by` +
            `\r\n\r\nName: ______________________________________` +
            `\r\n\r\nSignature: ___________________________________`,
          colSpan: 4,
          styles: { fontSize: 8 },
        },
      ],
      [
        {
          content:
            `\r\nReceived by` +
            `\r\n\r\nName: ______________________________________` +
            `\r\n\r\nSignature: ___________________________________`,
          colSpan: 4,
          styles: { fontSize: 8 },
        },
      ],
      //margin
      [{ content: ``, colSpan: 4, styles: { minCellHeight: 20 } }],
      [
        {
          content:
            `Thank you! All cheques payable to Viebeg Medical and Dental Supplies Ltd.` +
            `\r\n\r\n` +
            `DISCLAIMER: This invoice is not an official invoice and is only valid together with the EBM invoice provided by VIEBEG upon delivery of the goods.`,
          colSpan: 4,
          styles: { fontSize: 8, textColor: '#8fa2b4' },
        },
      ],
    ];
    var k = 5;
    pdfdata.forEach((element) => pdfbody.splice(k, 0, element));
    ++k;
    doc.autoTable({
      theme: 'grid',
      margin: { top: 190 },
      styles: { lineColor: 'black', lineWidth: 0, textColor: '#204569' },
      body: pdfbody,
    });
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  return (
    <div className="catalog_page content_block">
      <div className="link_back">
        <Link to="/main/regional-managers/">
          <img src={Path} alt="Path" />
          Regions & representatives
        </Link>
      </div>
      <div className="custom_title_wrapper">
        <div className="title_page manager-title">{currentManager && currentManager.username}</div>
      </div>
      <div className="manager-email">
        {currentManager && currentManager.email} / {currentManager && currentManager.region}
      </div>
      <div className="inner_sales_content_page">
        <div className="table_panel">
          <div>
            <input
              placeholder="Search by customer…"
              value={search}
              onChange={(e) => {
                getSalesOrders(id, 1, e.target.value, activeStatus && activeStatus.value);

                setActivePage(1);
                setSearch(e.target.value);
              }}
            />
            <FormControl className="select_wrapper">
              <SelectComponent
                value={activeStatus}
                options={status_list}
                change={(e) => {
                  setActivePage(1);
                  setActiveStatus(e);
                }}
                isClearable={true}
                isSearchable={false}
                placeholder="Select…"
              />
            </FormControl>
          </div>
          <Link to="/main/orders-inner-add">+ ADD INVOICE</Link>
        </div>
        <div className="order_page_table">
          <div className="table_container transactions_columns">
            <div className="table_header">
              <div className="table_row">
                <div className="row_item">Date/time</div>
                <div className="row_item">ID/PI#</div>
                <div className="row_item">Customer</div>
                <div className="row_item">Balance</div>
                <div className="row_item">Status</div>
                <div className="row_item" />
              </div>
            </div>
            <div className="table_body">
              {data &&
                data.results &&
                data.results.map(
                  ({
                    id: orderId,
                    date,
                    customer_name,
                    balance,
                    status,
                    created_by_id,
                    request,
                    payment_status,
                    tax_invoice_file,
                  }) => (
                    <div className="table_row" key={orderId}>
                      <div className="row_item">{moment(date).format('DD/MM/YYYY HH:mm')}</div>
                      <div className="row_item">
                        <Link to={`/main/orders-inner-edit/${orderId}/?id=${id}`}>{request}</Link>
                      </div>
                      <div className="row_item">
                        <Link to={`/main/customers/inner/${created_by_id}`}>{customer_name}</Link>
                      </div>
                      <div className="row_item">{balance || '-'}</div>
                      <div className="row_item">
                        <div>
                          <p className="status-name">
                            {returnStatusName(status)}
                            {status === 'sales_to_approve' ||
                            status === 'order' ||
                            status === 'delivery' ? (
                              <span className="blue-dot" />
                            ) : (
                              ''
                            )}
                          </p>
                          {(status === 'sales_to_approve' ||
                            status === 'sales_review' ||
                            status === 'sales_rejected') && (
                            <p className="request-status">
                              {status === 'sales_to_approve'
                                ? 'Waiting for approval'
                                : status === 'sales_review'
                                ? 'Reviewing by Sales Rep.'
                                : 'Rejected'}
                            </p>
                          )}
                        </div>

                        {(status === 'invoice' || status === 'receipt') &&
                          (payment_status === 'overdue' ? (
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
                          ) : null)}
                      </div>
                      <div className="row_item">
                        {(status === 'invoice' ||
                          status === 'receipt' ||
                          status === 'proforma' ||
                          status === 'sales_to_approve' ||
                          status === 'sales_review' ||
                          status === 'order' ||
                          status === 'sales_rejected') && (
                          <>
                            <img
                              src={PrintSVG}
                              alt="print"
                              onClick={() => GetCurrOrder(orderId)}
                              data-tip
                              data-for={`print-${orderId}`}
                            />
                            <ReactTooltip
                              id={`print-${orderId}`}
                              effect="solid"
                              place="top"
                              backgroundColor="#FFFFFF"
                              textColor="#334150"
                              className="tooltip">
                              <span>Print</span>
                            </ReactTooltip>
                          </>
                        )}
                        {
                          <div>
                            {!tax_invoice_file ? (
                              <>
                                <label for="fileInp">
                                  <img
                                    src={Upload}
                                    style={{
                                      cursor: 'pointer',
                                    }}
                                    alt="upload"
                                    data-tip
                                    data-for={`upload-${orderId}`}
                                  />
                                  <ReactTooltip
                                    id={`upload-${orderId}`}
                                    effect="solid"
                                    place="top"
                                    backgroundColor="#FFFFFF"
                                    textColor="#334150"
                                    className="tooltip">
                                    <span>Upload tax invoice</span>
                                  </ReactTooltip>
                                </label>
                                <input
                                  style={{
                                    display: 'none',
                                  }}
                                  type="file"
                                  id="fileInp"
                                  onChange={(e) => {
                                    let tax_file = e.target.files[0];
                                    const formData = new FormData();
                                    tax_file && formData.append('tax_invoice_file', tax_file);

                                    partialChangeOrder(orderId, formData).then((res) => {
                                      if (
                                        res.payload &&
                                        res.payload.status &&
                                        res.payload.status === 200
                                      ) {
                                        getSalesOrders(
                                          id,
                                          activePage,
                                          search,
                                          activeStatus && activeStatus.value,
                                        );
                                      }
                                    });
                                  }}
                                />
                              </>
                            ) : (
                              <a href={tax_invoice_file} download target="_blank">
                                <>
                                  <img
                                    src={Download}
                                    alt="download"
                                    data-tip
                                    data-for={`download-${orderId}`}
                                  />
                                  <ReactTooltip
                                    id={`download-${orderId}`}
                                    effect="solid"
                                    place="top"
                                    backgroundColor="#FFFFFF"
                                    textColor="#334150"
                                    className="tooltip">
                                    <span>Download tax invoice</span>
                                  </ReactTooltip>
                                </>
                              </a>
                            )}
                          </div>
                        }
                      </div>
                    </div>
                  ),
                )}
            </div>
          </div>
        </div>

        {data && data.count && data.count > 10 ? (
          <div className="pagination_info_wrapper">
            <div className="pagination_block">
              <Pagination
                active={activePage - 1}
                pageCount={data.count && Math.ceil(data.count / 10)}
                onChange={changePage}
              />
            </div>

            <div className="info">Displaying page 1 of 2, items 1 to 10 of 12</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = ({ managers }) => {
  return {
    managers: managers.list,
    data: managers.orders,
  };
};

const mapDispatchToProps = {
  getSales,
  getSalesOrders,
  changeOrder,
  getActivityOrder,
  partialChangeOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(InnerSales);
