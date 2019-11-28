import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';

import Loader from '../components/Loader';
import CoinTable from '../components/CoinTable';



class DefaultDashboard extends Component {

    constructor(props) {
        super(props);
        const { dispatch } = this.props;
    }

    render() {

        return (
            <React.Fragment>
                <div className="">
                    { /* preloader */}
                    {this.props.loading && <Loader />}

                    <Row>
                        <Col lg={12}>
                            <div className="page-title-box">
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><a href="/">Coins</a></li>
                                        <li className="breadcrumb-item active">Dashboard</li>
                                    </ol>
                                </div>
                                <h4 className="page-title">Top Coins</h4>

                            </div>
                        </Col>

                    </Row>

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <CoinTable />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        )
    }
}

export default connect()(DefaultDashboard);
