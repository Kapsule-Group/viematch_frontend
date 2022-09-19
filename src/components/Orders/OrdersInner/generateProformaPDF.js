import jsPDF from 'jspdf';
import moment from 'moment';
import { data_image } from '../OrdersInner/imagedata';
import { sortFunction } from '../../../actions/invoiceActions';
import axios from 'axios';
import { API_BASE_URL } from '../../../../src/config';

export default function generateProformaPDF(client_data, props) {
  var doc = new jsPDF('p', 'pt');
  let imageData = data_image;

  const pdfdat1 = client_data.items;
  const pdfdata = pdfdat1.map((elt) => [
    { content: elt.product_name, styles: { fontStyle: 'bold' } },
    { content: elt.pack_size ? elt.pack_size : '—', styles: { halign: 'right' } },
    {
      content: new Intl.NumberFormat('en-US').format(elt.quantity),
      styles: { halign: 'right' },
    },
    {
      content: elt.availability,
      styles: { halign: 'right' },
    },
    {
      content: `${client_data.currency != null ? client_data.currency : ''}${new Intl.NumberFormat(
        'en-US',
        {
          minimumFractionDigits: 0,
        },
      ).format(Number(elt.price_per_unit).toFixed(2))}`,
      styles: { halign: 'right' },
    },
    {
      content: `${client_data.currency != null ? client_data.currency : ''}${new Intl.NumberFormat(
        'en-US',
      ).format(Number(+elt.quantity * +elt.price_per_unit).toFixed(2))}`,
      styles: { halign: 'right' },
    },
  ]);
  pdfdata.sort(sortFunction);
  const reducer = (accumulator, currentValue) => Number(accumulator) + Number(currentValue);
  var total = [];

  axios
    .get(`${API_BASE_URL}/region/${client_data.region.id}/get-logo/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then((resp) => {
      const logo = `data:image/png;base64,${resp.data.logo}`;
      doc.addImage(logo, 'PNG', 30, 60, 200, 90);
    });

  axios
    .get(`${API_BASE_URL}/region/${client_data.region.id}/get-image/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then((resp) => {
      const stamp = `data:image/png;base64,${resp.data.image}`;

      //STAMP CALCULATIONS. THE STAMP POSITION DEPEND ON VAT AND QAENTITY ROWS, SO Y - SHOULD BE CALCULATED AUTOMATICALY. FOR EACH NEW ROW YOU SHOULD ADD +20
      let endOfTableY = doc.autoTableEndPosY();
      let posytionYCOORD = endOfTableY - 150;
      let rowsItems = client_data.items.length;
      //let positionYVAT = 410 + (rowsItems - 1) * (rowsItems > 10 ? 18 : 25);

      resp.data.image !== null && doc.addImage(stamp, 'PNG', 420, posytionYCOORD, 100, 100); // X Y W H 420, 410, 100, 100

      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    });

  var z = 0;
  pdfdata.forEach((element) => total.splice(z, 0, Number(element[3]).toFixed(2)));
  ++z;
  var total1 = total.reduce(reducer, 0);
  doc.setFont('Helvetica');
  doc.setTextColor('#204569');
  doc.setFontSize(8);
  client_data &&
    client_data.region &&
    client_data.region.header &&
    client_data.region.header &&
    doc.text(250, 70, client_data.region.header);

  client_data &&
    client_data.region &&
    client_data.region.address1 &&
    client_data.region.address1 &&
    doc.text(250, 85, client_data.region.address1);
  client_data &&
    client_data.region &&
    client_data.region.address2 &&
    client_data.region.address2 &&
    doc.text(250, 100, client_data.region.address2);
  client_data &&
    client_data.region &&
    client_data.region.address3 &&
    client_data.region.address3 &&
    doc.text(250, 115, client_data.region.address3);
  client_data &&
    client_data.region &&
    client_data.region.address4 &&
    client_data.region.address4 &&
    doc.text(250, 130, client_data.region.address4);
  client_data &&
    client_data.region &&
    client_data.region.address5 &&
    client_data.region.address5 &&
    doc.text(250, 145, client_data.region.address5);
  client_data &&
    client_data.region &&
    client_data.region.address6 &&
    client_data.region.address6 &&
    doc.text(250, 160, client_data.region.address6);
  client_data &&
    client_data.region &&
    client_data.region.address7 &&
    client_data.region.address7 &&
    doc.text(250, 175, client_data.region.address7);
  client_data &&
    client_data.region &&
    client_data.region.address8 &&
    client_data.region.address8 &&
    doc.text(250, 190, client_data.region.address8);
  doc.setFontSize(10);
  var pdfbody = [
    [
      {
        content: `${'PROFORMA INVOICE'}`,
        colSpan: 6,
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
        content: `CLIENT NAME`,
        colSpan: 3,
        rowSpan: 1,
        styles: {
          fontSize: 10,
          fontStyle: 'bold',
          valign: 'bottom',
        },
      },
      {
        content: `id\r\nDate\r\n SALES REP\r\n Quotation Validity`.toUpperCase(),
        colSpan: 2,
        rowSpan: 2,
        styles: {
          fontSize: 8,
          halign: 'right',
          fontStyle: 'bold',
          overflow: 'linebreak',
          cellPadding: { top: 30, right: 5 },
        },
      },
      {
        content:
          `${client_data.request}` +
          `\r\n${moment(client_data.date).format('DD/MM/YYYY')}` +
          `\r\n${
            client_data && client_data.sales_pdf && client_data.sales_pdf
              ? client_data.sales_pdf === 'VIEBEG MEDICAL LTD'
                ? 'Viebeg Medical LTD'
                : client_data.sales_pdf
              : '-'
          }` +
          `\r\n${client_data.due_date ? moment(client_data.due_date).format('DD/MM/YYYY') : '-'}
          `,
        colSpan: 1,
        rowSpan: 2,
        styles: { fontSize: 8, cellPadding: { top: 30 } },
      },
    ],
    [
      {
        content: `${client_data.customer_name.toUpperCase()}\r\n \r\n${
          client_data.tin ? 'TIN' : ''
        } ${client_data.tin ? client_data.tin : ''}`,
        colSpan: 2,
        rowSpan: 1,
        styles: { fontSize: 10, fontStyle: 'bold', valign: 'top' },
      },

      '',
      '',
    ],

    [
      {
        content: '———————————————————————————————————————————————————',
        colSpan: 6,
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
        content: 'ITEM DESCRIPTION                                                       ',
        styles: { fillColor: '#EBF4FE' },
      },

      {
        content: 'P.SIZE',
        styles: { fillColor: '#EBF4FE', halign: 'right' },
      },

      {
        content: 'QTY',
        styles: { fillColor: '#EBF4FE', halign: 'right' },
      },
      {
        content: 'AVAL',
        styles: { fillColor: '#EBF4FE', halign: 'right' },
      },
      {
        content: 'UN. PRICE',
        styles: {
          fillColor: '#EBF4FE',
          halign: 'right',
          cellPadding: { top: 5, right: 0 },
        },
      },
      {
        content: '     TOTAL',
        styles: {
          fillColor: '#EBF4FE',
          halign: 'right',
          cellPadding: { top: 5, right: 5 },
        },
      },
    ],

    [
      {
        content:
          '—  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —',
        colSpan: 6,
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
        content: ``,
        colSpan: 4,
        rowSpan: 2,
        styles: { halign: 'left', fontSize: 8 },
      },
      {
        content: 'TOTAL',
        rowSpan: 1,
        styles: { valign: 'bottom' },
      },
      {
        content: `${
          client_data.total !== null
            ? `${client_data.currency != null ? client_data.currency : ''}${new Intl.NumberFormat(
                'en-US',
              ).format(client_data.total.toFixed(0))}`
            : '—'
        }`,
        rowSpan: 1,
        styles: {
          valign: 'top',
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'right',
        },
      },
    ],

    [{ content: ``, colSpan: 4, styles: { minCellHeight: 5 } }],

    [
      {
        content: ``,
        colSpan: 4,
        rowSpan: 1,
        styles: { halign: 'left', fontSize: 8 },
      },

      {
        content: client_data.notes ? client_data.notes : '',
        rowSpan: 1,
        colSpan: 3,
        styles: { valign: 'bottom' },
      },
    ],

    [{ content: ``, colSpan: 4, styles: { minCellHeight: 20 } }],

    [
      {
        content:
          `VAT EXMPTED` +
          `\r\n${client_data &&
            client_data.region &&
            client_data.region.bank_info1 &&
            client_data.region.bank_info1}` +
          `${client_data &&
            client_data.region &&
            client_data.region.bank_info2 &&
            '\r\n' + client_data.region.bank_info2}` +
          `${client_data &&
            client_data.region &&
            client_data.region.bank_info3 &&
            '\r\n' + client_data.region.bank_info3}` +
          `${client_data &&
            client_data.region &&
            client_data.region.bank_info4 &&
            '\r\n' + client_data.region.bank_info4}` +
          `${client_data &&
            client_data.region &&
            client_data.region.delivery_info1 &&
            '\r\n' + client_data.region.delivery_info1}` +
          `${client_data &&
            client_data.region &&
            client_data.region.delivery_info2 &&
            '\r\n' + client_data.region.delivery_info2}` +
          `${client_data &&
            client_data.region &&
            client_data.region.delivery_info3 &&
            '\r\n' + client_data.region.delivery_info3}`,
        colSpan: 4,
        styles: { fontSize: 8 },
      },
    ],

    [
      {
        content: '',
        colSpan: 4,
        styles: { fontSize: 8 },
      },
    ],

    //margin
    [
      {
        content:
          `${client_data &&
            client_data.region &&
            client_data.region.footer1 &&
            client_data.region.footer1}` +
          `\r\n\r\n` +
          `${client_data &&
            client_data.region &&
            client_data.region.footer2 &&
            client_data.region.footer2}`,
        colSpan: 6,
        styles: { fontSize: 8, textColor: '#8fa2b4' },
      },
    ],
  ];
  var k = 5;
  pdfdata.forEach((element) => pdfbody.splice(k, 0, element));
  ++k;
  let rowItems = client_data.items.length;
  doc.autoTable({
    theme: 'grid',
    margin: { top: 190 },
    styles: {
      lineColor: 'black',
      lineWidth: 0,
      textColor: '#204569',
      fillColor: null,
      fontSize: `${rowItems > 10 ? 8 : 10}`,
    },
    body: pdfbody,
  });
}
