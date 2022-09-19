import jsPDF from 'jspdf';
import moment from 'moment';
import { data_image } from './imagedata';
import axios from 'axios';
import { API_BASE_URL } from '../../../../src/config';

export default function generatePDF(client_data, props, isMainPage) {
  function sortFunction(a, b) {
    var dateA = new Date(a.date_created).getTime();
    var dateB = new Date(b.date_created).getTime();
    return dateA > dateB ? 1 : -1;
  }

  const { currency } = client_data;

  var doc = new jsPDF('p', 'pt');
  let imageData = data_image;
  const pdfdat1 = client_data.items;
  let rowItems = client_data.items.length;
  const pdfdata = pdfdat1.map((elt) => [
    {
      content: elt.product_name,
      colSpan: 1,
      styles: { fontStyle: 'bold', fontSize: 8, cellPadding: 4 },
    },
    {
      content: new Intl.NumberFormat('en-US').format(Number(elt.quantity)),
      colSpan: 1,
      styles: { halign: 'right', fontSize: 8, cellPadding: 4 },
    },
    {
      content: `${currency != null ? currency : ''}${new Intl.NumberFormat('en-US').format(
        Number(elt.price_per_unit).toFixed(2),
      )}`,
      colSpan: 1,
      styles: { halign: 'right', fontSize: 8, cellPadding: 4 },
    },
    {
      content: `${currency != null ? currency : ''}${new Intl.NumberFormat('en-US').format(
        Number(+elt.quantity * +elt.price_per_unit).toFixed(2),
      )}`,
      colSpan: 1,
      styles: { halign: 'right', fontSize: 8, cellPadding: 4 },
    },
  ]);
  pdfdata.sort(sortFunction);

  axios
    .get(`${API_BASE_URL}/region/${client_data.region.id}/get-logo/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then((resp) => {
      const logo = `data:image/png;base64,${resp.data.logo}`;
      doc.addImage(logo, 'PNG', 30, 60, 188, 70);
    });

  axios
    .get(`${API_BASE_URL}/region/${client_data.region.id}/get-image/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then((resp) => {
      const stamp = `data:image/png;base64,${resp.data.image}`;

      //STAMP CALCULATIONS. THE STAMP POSITION DEPEND ON VAT AND QAENTITY ROWS, SO Y - SHOULD BE CALCULATED AUTOMATICALY. FOR EACH NEW ROW YOU SHOULD ADD +20
      let endOfTableY = doc.autoTableEndPosY();
      let posytionYCOORD = endOfTableY - 140;
      let rowsItems = client_data.items.length;
      let positionYVAT = 485 + (rowsItems - 1) * (rowItems > 10 ? 18 : 22);
      let positionY = 400 + (rowsItems - 1) * (rowItems > 10 ? 20 : 25);

      resp.data.image !== null && doc.addImage(stamp, 'PNG', 420, posytionYCOORD, 100, 100);

      isMainPage !== true && doc.save(client_data.customer_name + '_profomer.pdf');

      //DEPEND ON PAGE ==> if MAIN PAGE show PDF BEFORE DOWNLOAD

      isMainPage === true && doc.autoPrint();
      isMainPage === true && window.open(doc.output('bloburl'), '_blank');
    });

  const reducer = (accumulator, currentValue) => Number(accumulator) + Number(currentValue);
  var total = [];

  const tin = client_data && client_data.tin && client_data.tin.toString();

  let vatValue =
    client_data && client_data.region && client_data.region.vat
      ? (client_data.total * client_data.region.vat) / (100 + +client_data.region.vat)
      : 0;
  let subTotalValue = client_data.total - vatValue;

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
        content: `${
          client_data.status === 'delivered' ? 'Delivery Note' : client_data.status.toUpperCase()
        }`,
        colSpan: 4,
        styles: {
          halign: 'left',
          fontSize: 15,
          cellPadding: 0,
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
        content: `${
          client_data.status !== 'invoice' ? 'ID' : 'Invoice no'
        }\r\nDate\r\nDue Date\r\nTerms`.toUpperCase(),
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
          `\r\n${moment(client_data.date).format('DD/MM/YYYY')}` +
          `\r\n${
            client_data.due_date === null ? '—' : moment(client_data.due_date).format('DD/MM/YYYY')
          }` +
          `\r\nNet 30`,
        colSpan: 1,
        rowSpan: 2,
        styles: { fontSize: 10 },
      },
    ],
    [{ content: ``, colSpan: 4, styles: { minCellHeight: 5 } }],
    [
      {
        content: '———————————————————————————————————————————————————',
        colSpan: 4,
        styles: {
          valign: 'middle',
          halign: 'center',
          textColor: '#e3e7ec',
          fontStyle: 'bold',
          minCellHeight: 10,
        },
      },
    ],

    [
      {
        content: 'title title title title title title title title title title title title title',
        colSpan: 1,
        styles: { fillColor: '#EBF4FE', textColor: '#EBF4FE' },
      },
      {
        content: 'QTY',
        colSpan: 1,
        styles: { fillColor: '#EBF4FE', halign: 'right' },
      },
      {
        content: 'RATE',
        colSpan: 1,
        styles: { fillColor: '#EBF4FE', halign: 'right' },
      },
      {
        content: 'AMOUNT',
        colSpan: 1,
        styles: { fillColor: '#EBF4FE', halign: 'right' },
      },
    ],

    [
      { content: '', colSpan: 1 },
      {
        content: '—  —  —  —  —  —  —  —  —  —  —  —  —  —  ',
        colSpan: 3,
        styles: {
          valign: 'middle',
          halign: 'center',
          cellPadding: 0,
          textColor: '#e3e7ec',
          fontStyle: 'bold',
          minCellHeight: 10,
        },
      },
    ],
    [
      {
        content: '',
        colSpan: 1,
        styles: { fillColor: '#fff', cellPadding: 0 },
      },
      {
        content: 'SUBTOTAL',
        colSpan: 1,
        styles: {
          fillColor: '#fff',
          halign: 'right',
          fontSize: 8,
          cellPadding: 0,
        },
      },
      {
        content: '',
        colSpan: 1,
        styles: { fillColor: '#fff', halign: 'right', cellPadding: 0 },
      },
      {
        content: `${currency != null ? currency : ''}${new Intl.NumberFormat('en-US').format(
          Number(subTotalValue).toFixed(0),
        )}`,
        colSpan: 1,
        styles: { fillColor: '#fff', halign: 'right', cellPadding: 0 },
      },
    ],

    [
      { content: '', colSpan: 1 },
      {
        content: '—  —  —  —  —  —  —  —  —  —  —  —  —  —  ',
        colSpan: 3,
        styles: {
          valign: 'middle',
          halign: 'center',
          cellPadding: 0,
          textColor: '#e3e7ec',
          fontStyle: 'bold',
          minCellHeight: 10,
          width: '100%',
        },
      },
    ],

    [
      {
        content: '',
        colSpan: 1,
        styles: { fillColor: '#fff', cellPadding: 0 },
      },
      {
        content: 'VAT ',
        colSpan: 1,
        styles: {
          fillColor: '#fff',
          halign: 'right',
          fontSize: 8,
          cellPadding: 0,
        },
      },
      {
        content:
          client_data &&
          client_data.region &&
          client_data.region.vat &&
          client_data.region.vat + `%`,
        colSpan: 1,
        styles: { fillColor: '#fff', halign: 'right', cellPadding: 0 },
      },
      {
        content: `${currency != null ? currency : ''}${new Intl.NumberFormat('en-US').format(
          Number(vatValue).toFixed(0),
        )}`,
        colSpan: 1,
        styles: { fillColor: '#fff', halign: 'right', cellPadding: 0 },
      },
    ],

    [
      { content: '', colSpan: 1 },
      {
        content: '—  —  —  —  —  —  —  —  —  —  —  —  —  —  ',
        colSpan: 3,
        styles: {
          valign: 'middle',
          halign: 'center',
          cellPadding: 0,
          textColor: '#e3e7ec',
          fontStyle: 'bold',
          minCellHeight: 10,
          width: '100%',
        },
      },
    ],

    [
      {
        content: '',
        colSpan: 1,
        styles: { fillColor: '#fff', cellPadding: 0 },
      },
      {
        content: 'TOTAL',
        colSpan: 1,
        styles: {
          fillColor: '#fff',
          halign: 'right',
          fontSize: 8,
          cellPadding: 0,
        },
      },
      {
        content: '',
        colSpan: 1,
        styles: { fillColor: '#fff', halign: 'right', cellPadding: 0 },
      },
      {
        content: `${currency != null ? currency : ''}${new Intl.NumberFormat('en-US').format(
          Number(client_data.total).toFixed(0),
        )}`,
        colSpan: 1,
        styles: {
          fillColor: '#fff',
          halign: 'right',
          fontStyle: 'bold',
          cellPadding: 0,
        },
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
          minCellHeight: 10,
        },
      },
    ],
    [
      {
        content:
          `${client_data &&
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
        content: `${currency != null ? currency : ''}${new Intl.NumberFormat('en-US').format(
          Number(client_data.total).toFixed(0),
        )}`,

        rowSpan: 1,
        styles: { valign: 'bottom', halign: 'right', fontStyle: 'bold' },
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
            ? `${currency != null ? currency : ''}${new Intl.NumberFormat('en-US').format(
                Number(client_data.balance).toFixed(0),
              )}`
            : '—'
        }`,
        rowSpan: 1,
        styles: {
          valign: 'top',
          fontSize: 18,
          fontStyle: 'bold',
          halign: 'right',
          cellPadding: 0,
        },
      },
    ],

    [{ content: ``, colSpan: 4, styles: { minCellHeight: 5 } }],

    [
      {
        content:
          `Prepared by` +
          `\r\n\r\nName: ______________________________________` +
          `\r\n\r\nSignature: ___________________________________`,
        colSpan: 4,
        styles: { fontSize: 6, cellPadding: 0 },
      },
    ],
    [
      {
        content:
          `\r\nReceived by` +
          `\r\n\r\nName: ______________________________________` +
          `\r\n\r\nSignature: ___________________________________`,
        colSpan: 4,
        styles: { fontSize: 6, cellPadding: 0 },
      },
    ],
    //margin
    [{ content: ``, colSpan: 4, styles: { minCellHeight: 10 } }],
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
        colSpan: 4,
        styles: { fontSize: 6, textColor: '#8fa2b4', cellPadding: 0 },
      },
    ],
  ];
  var pdfbodyWithoutVat = [
    [
      {
        content: `${
          client_data.status === 'delivered' ? 'Delivery Note' : client_data.status.toUpperCase()
        }`,
        colSpan: 4,
        styles: {
          halign: 'left',
          fontSize: 15,
          cellPadding: 0,
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
        content: `${
          client_data.status !== 'invoice' ? 'ID' : 'Invoice no.'
        }\r\nDate\r\nDue Date\r\nTerms`.toUpperCase(),
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
          `\r\n${moment(client_data.date).format('DD/MM/YYYY')}` +
          `\r\n${
            client_data.due_date === null ? '—' : moment(client_data.due_date).format('DD/MM/YYYY')
          }` +
          `\r\nNet 30`,
        colSpan: 1,
        rowSpan: 2,
        styles: { fontSize: 10 },
      },
    ],
    [
      {
        content: tin
          ? `${client_data.customer_name.toUpperCase()}` + `\r\nTIN ${tin}`
          : `${client_data.customer_name.toUpperCase()}`,
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
          minCellHeight: 10,
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
      { content: '', styles: { fillColor: '#fff' } },
      {
        content: 'TOTAL',
        styles: { fillColor: '#fff', halign: 'right' },
      },
      {
        content: '',
        styles: { fillColor: '#fff', halign: 'right' },
      },
      {
        content: `${currency != null ? currency : ''}${new Intl.NumberFormat('en-US').format(
          Number(client_data.total).toFixed(2),
        )}`,
        styles: { fillColor: '#fff', halign: 'right', fontStyle: 'bold' },
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
          minCellHeight: 10,
        },
      },
    ],
    [
      {
        content:
          `${client_data &&
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
        content: `${currency != null ? currency : ''}${new Intl.NumberFormat('en-US').format(
          Number(client_data.total).toFixed(2),
        )}`,
        rowSpan: 1,
        styles: { valign: 'bottom', halign: 'right', fontStyle: 'bold' },
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
            ? `${currency != null ? currency : ''}${new Intl.NumberFormat('en-US').format(
                Number(client_data.balance).toFixed(0),
              )}`
            : '—'
        }`,
        rowSpan: 1,
        styles: {
          valign: 'top',
          fontSize: 18,
          fontStyle: 'bold',
          halign: 'right',
          cellPadding: 0,
        },
      },
    ],

    [{ content: ``, colSpan: 4, styles: { minCellHeight: 10 } }],
    [
      {
        content: ``,
        colSpan: 3,
        rowSpan: 1,
        styles: { halign: 'left', fontSize: 8 },
      },

      {
        content: client_data.notes ? client_data.notes : '',
        rowSpan: 1,
        colSpan: 1,
        styles: { valign: 'bottom', fontSize: 8 },
      },
    ],
    //margin
    [{ content: ``, colSpan: 4, styles: { minCellHeight: 10 } }],
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
    [{ content: ``, colSpan: 4, styles: { minCellHeight: 10 } }],
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
        colSpan: 4,
        styles: { fontSize: 6, textColor: '#8fa2b4', cellPadding: 0 },
      },
    ],
  ];
  var k = 5;
  vatValue =
    client_data && client_data.region && client_data.region.vat !== 0
      ? pdfdata.forEach((element) => pdfbody.splice(k, 0, element))
      : pdfdata.forEach((element) => pdfbodyWithoutVat.splice(k, 0, element));

  ++k;
  doc.autoTable({
    theme: 'grid',
    margin: { top: 190 },
    styles: {
      lineColor: 'black',
      lineWidth: 0,
      textColor: '#204569',
      fillColor: null,
    },
    body:
      client_data && client_data.region && client_data.region.vat !== 0
        ? pdfbody
        : pdfbodyWithoutVat,
  });
}
