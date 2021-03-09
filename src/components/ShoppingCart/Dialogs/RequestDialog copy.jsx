import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Pagination from '../HelperComponents/Pagination/Pagination';
import { getActivity, sortFunction } from "../../actions/activityActions";
import { getStock } from "../../actions/stockActions";
import './Activity.scss';
import { Table, Button } from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import jsPDF from 'jspdf';
import 'jspdf-autotable'
import { data_image } from "./imagedata";
import imageData from '../../assets/image/logo.png';

class Activity extends Component {

    state = {
        stock: 'in',
        activePage: 1,
        loading: true,

        activity:
        {
            label:
                <div>

                </div>
            , value: "supply_requests"
        }

    };

    componentDidMount() {
        this.doRequest();
        //this.doStock();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    };

    doRequest = (page = 1) => {
        const { getActivity } = this.props;
        const { activity } = this.state;
        getActivity(activity.value, page).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({ loading: false });
            }
        })
    };

    /*doStock = (page = 1) => {
        const { getStock } = this.props;
        const { stock, switcherState } = this.state;
        getStock(stock, page !== undefined ? page : false, switcherState).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                if (page !== undefined) {
                    this.setState({
                        loading: false,
                        activePage: page,
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
    };*/
    changePage = (page) => {
        this.setState({ activePage: page.selected + 1 });
        this.doRequest(page.selected + 1);
        //this.doStock(page.selected + 1);
    };

    handleChange = name => event => {
        // const status = { status: event.value }
        this.setState({ [name]: event });
        this.timer = this.timeout = setTimeout(() => {
            this.doRequest();
            //this.doStock();
        }, 0);
    };
    showModal = (e) => {
        this.setState({ model: true });
    };
    hideModal = (e) => {
        this.setState({ model: false });
    }
    generatePDF = (client_data, Date, Product, Quanity, Price, customer) => {
        var doc = new jsPDF('p', 'pt');
        let imageData = data_image;
        const pdfdata = client_data.map(elt => [elt.product_name, elt.quantity, elt.price, elt.quantity * elt.price]);
        pdfdata.sort(sortFunction);
        doc.addImage(imageData, 'PNG', 30, 40, 250, 75)
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        var total = [];

        var z = 0;
        pdfdata.forEach(element => (total.splice(z, 0, element[3])));
        ++z;
        var total1 = total.reduce(reducer);

        doc.setFont('times')
        doc.setFontType('italic')
        doc.setFontSize(10)
        doc.text(290, 50, 'Address: K&M Building 1st Floor Opposite Sonatube kicukiro kigali')
        doc.text(290, 65, 'Email: alex@viebeg.com / tobias@viebeg.com')
        doc.text(290, 80, 'Website: www.viebeg.com')
        doc.text(290, 95, 'Office line: +250782205366 Tel: +250787104894')
        var pdfbody = [
            [{ content: 'PROFORMA INVOICE', colSpan: 4, styles: { halign: 'center', fontSize: 12, font: 'times', fontStyle: 'bold' } }],
            [{ content: 'Client Name: Legacy Clinic\r\nPI#: PI01\r\nDate: 13/07/2020\r\nSales Rep: Cecile', colSpan: 4, styles: { font: 'italic', fontSize: 10, fontStyle: 'bold' } }],
            ['ITEM DESCRIPTION', 'QTY', 'UNIT PRICE', 'SUB TOTAL'],
            [{ content: '', colSpan: 2, styles: { halign: 'center' } }, 'Total', total1],
            [{ content: 'VAT EXEMPTED\r\nTIN: 107902413\r\Account Number: 21102347510015100000 / GT Bank, Main Branch \r\n Delivery: Immediately', colSpan: 4, styles: { font: 'italic', fontSize: 10, fontStyle: 'bold' } }],
        ]
        var k = 3;
        pdfdata.forEach(element => (pdfbody.splice(k, 0, element)));
        ++k;
        doc.autoTable({
            theme: "grid",
            margin: { top: 150 },
            styles: { lineColor: 'black', lineWidth: 1, },
            body: pdfbody

        });

        doc.save(customer + '_profomer.pdf')
    }

    render() {

        const { activePage, activities_list, activity, loading, } = this.state;
        const { activityLog } = this.props;
        const addtopdf = [];

        const AllCartRequests = consolidatedrequests => {
            return Object.keys(consolidatedrequests).reduce((groups, key) => {
                const currentRequest = consolidatedrequests[key];
                const groupId = currentRequest.group - 1;
                if (!groups[groupId]) {
                    groups[groupId] = [];
                }
                groups[groupId].push(currentRequest);
                return groups;
            }, []);
        };
        //let SingleRequest = activityLog.results;
        //console.log(SingleRequest.groupBy("requestid"))
        //.groupBy("requestid"))
        if (loading) return null;
        return (

            <div className="activity_page content_block" style={{ backgroundColor: "#EBF4FE" }}>

                <div className="title_page">Profomas invoice</div>
                <div className="activity_block">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>DATE</th>
                                <th>REQUEST</th>
                                <th>PDF</th>
                                <th>EMAIL</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activityLog.results && activityLog.results.length > 0 ?

                                activityLog.results.sort(sortFunction).map((el, index) => (
                                    <tr>
                                        {el.incart === "False" ?
                                            <>
                                                {addtopdf.push(el)}
                                                <td key={index}>{moment(el.date_created).format('DD/MM/YYYY')}</td>
                                                <td><button onClick={() => { this.showModal(el.date_created, el.product_name, el.quantity, el.price, el.customer_name) }} type="primary"><b>{el.quantity}</b> requests of {el.product_name}</button></td>

                                                <td>

                                                    <div>
                                                        <button onClick={() => { this.generatePDF(addtopdf) }} type="primary">Download PDF</button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <button type="primary">Send Email</button>
                                                    </div>
                                                </td>

                                                <td>
                                                    <button className="btn btn-success btn-sm" onClick={() => { alert("We goin to approve") }}>Approve</button>
                                                </td>
                                            </>
                                            :
                                            <></>
                                        }

                                    </ tr >
                                ))
                                :
                                <h3>The list is empty.</h3>
                            }
                        </tbody>

                    </Table>

                    {activityLog.count > 10 &&
                        <div className="pagination_info_wrapper">
                            <div className="pagination_block">

                                <Pagination
                                    current={activePage}
                                    pageCount={activityLog.total_pages}
                                    onChange={this.changePage}
                                />

                            </div>
                            <div className="info">Displaying page {activePage} of {activityLog.total_pages},
                            items {activePage * 10 - 9} to {activePage * 10 > activityLog.count ? activityLog.count : activePage * 10} of {activityLog.count}</div>
                        </div>
                    }
                </div>


                <Modal size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.model}>
                    <Modal.Header>
                        <button type="button" className="close" onClick={this.hideModal} data-dismiss="modal">&times;</button>
                    </Modal.Header>
                    <ModalBody className="modelBody">
                        <table style={{ marginBottom: '25px' }}>
                            <tr>
                                <td><img src={imageData} /> </td>
                                <td>
                                    Address: K&M Building 1st Floor Opposite Sonatube kicukiro kigali <br />
                                    Email: alex@viebeg.com / tobias@viebeg.com <br />
                                    Website: www.viebeg.com <br />
                                    Office line: +250782205366 Tel: +250787104894 <br />
                                </td>
                            </tr>

                        </table>
                        <table className="table table-bordered">
                            <tr><td colspan='6' id="proformaTitle">PROFORMA INVOICE</td></tr>
                            <tr><td colspan='6' id="clientDesc">Client Name: Legacy Clinic<tr />
                                                PI#: PI01<br />
                                                Date: 13/07/2020<br />
                                                Sales Rep: Cecile<br />
                            </td></tr>
                            <tr>
                                <td>ITEM DESCRIPTION</td>
                                <td>QTY</td>
                                <td>UNITY PRICE</td>
                                <td>TOTAL</td>
                                <td>STATUS</td>
                            </tr>
                            {activityLog.results && activityLog.results.length > 0 ?
                                activityLog.results.map((el, index) => (
                                    <tr>
                                        {el.incart === "False" ?

                                            <>
                                                <td key={index}>{el.product_name}</td>
                                                <td>{el.quantity}</td>
                                                <td>{el.price ? el.price : "Waiting to be processed"}</td>
                                                <td>{el.price * el.quantity}</td>
                                                <td> {el.status === "completed" ? "Approved" : "Processing"} </td>
                                            </>
                                            :
                                            <></>
                                        }

                                    </tr>
                                ))
                                :
                                <h3>The list is empty.</h3>
                            }

                        </table>
                    </ModalBody>
                    <Modal.Footer>
                        <button onClick={this.hideModal}>Close</button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        activityLog: state.activity.activityLog,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getActivity,
        getStock
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);