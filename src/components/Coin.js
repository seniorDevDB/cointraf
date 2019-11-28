import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';
import Loader from '../components/Loader';
import { Line } from 'react-chartjs-2';
import * as zoom from 'chartjs-plugin-zoom';
import { Badge } from 'reactstrap';
import { Redirect } from "react-router-dom";
import { Table } from 'reactstrap';
import fetchDataFromDatabase from './fetchDatas';
import { coinActions } from '../_actions';
import '../assets/css/SearchBar.css';

class Coin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coinData: null,
      mode: "all",
    }
  }

  componentDidMount() {
    // Fetching data of respective coin from firebase
    const {coin} = this.props;
    if (!(this.props.location.state && this.props.location.state.coinData && coin)) {
      const location_array = window.location.href.split("/")
      const coinName = location_array[location_array.length - 1];
      fetchDataFromDatabase().then(coins => {
        const _conin = coins.filter((coin) => coin.name === coinName);
        if(_conin.length === 1) {
          this.setState({ coinData: _conin });
        } else {
          window.location.href = "/";
        }
        this.props.dispatch(coinActions.saveCoin(coins));
      });
    }
  }

  // Function to fetch a particular coin data from firestore
  // fetchCoinData = (coinName) => {
  //   db.collection("coins").where("name", "==", coinName).get()
  //     .then(querySnapshot => {
  //       const coinData = querySnapshot.docs.map(doc => doc.data())[0];
  //       this.setState({ coinData });
  //     }).catch(function (error) {
  //       window.location.href = "/"
  //     });
  // }

  getGraphParams = (coinData) => {

    const chatUrl = coinData.chatUrl
    const labels = []
    const members_online = []
    const total_members = []
    const members_active = []
    const message_count = []

    if (coinData.data && coinData.data.length > 0) {
      for (let i = 0; i < coinData.data.length; i++) {
        labels.push(coinData.data[i]["date"]);
        members_online.push(coinData.data[i]["membersOnline"]);
        total_members.push(coinData.data[i]["memberCount"]);
        members_active.push(coinData.data[i]["membersActive"]);
        message_count.push(coinData.data[i]["messageCount"]);
      }

      const ret = {
        initial_time: coinData.data[0]['date'],
        chatUrl: chatUrl,
        labels: labels,
        total_members: total_members,
        members_online: members_online,
        members_active: members_active,
        message_count: message_count,
        name: coinData.name,
        logo: coinData.logo,
        lastTotalMember: coinData.data[coinData.data.length - 1].memberCount,
        lastMembersOnline: coinData.data[coinData.data.length - 1].membersOnline,
        lastMembersActive: coinData.data[coinData.data.length - 1].membersActive,
        lastMessageCount: coinData.data[coinData.data.length - 1].messageCount,
      };
      return ret;
    } else {
      return null;
    }
  }

  getTime = (time_type, initial_time) => {
    let current_date = new Date();
    let current_month = current_date.getMonth() + 1;
    let current_da = current_date.getDate();
    let all_start_month = initial_time;
    let week_start_date = current_da - 7;
    let day_start_date = current_da - 1;
    let all_start = current_date.getFullYear() + '/' + all_start_month + '/' + current_date.getDate();
    let week_start = current_date.getFullYear() + '/' + current_month + '/' + week_start_date;
    let day_start = current_date.getFullYear() + '/' + current_month + '/' + day_start_date;
    let month_start = current_date.getFullYear() + '/' + current_date.getMonth() + '/' + current_date.getDate();

    switch (time_type) {
      case 'month':
        return month_start;
      case 'week':
        return week_start;
      case 'hour':
        return day_start;
      default:
        return all_start;
    }
  }

  render() {
    const current_time = new Date();
    const current_month = current_time.getMonth() + 1;
    const currentTime = current_time.getFullYear() + '/' + current_month + '/' + current_time.getDate();
    const historyState = this.props.location.state;
    let graphData = null;
    if (historyState && historyState.coinData) {
      graphData = this.getGraphParams(historyState.coinData);
    } else if (this.state.coinData) {
      graphData = this.getGraphParams(this.state.coinData);
    } else {
      return (
        <div className="lds-dual-ring"></div>
      );
    }

    const options = {
      legend: {
        labels: {
          fontColor: "white",
          fontSize: 18
        }
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        yAxes: [{
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-1',
          ticks: {
            fontColor: '#39ff14'
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }, {
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-2',
          ticks: {
            fontColor: 'rgba(75,192,192,1)'
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }, {
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'right',
          id: 'y-axis-3',
          ticks: {
            fontColor: '#ff0000'
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }, {
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'right',
          id: 'y-axis-4',
          ticks: {
            fontColor: '#0000ff'
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }],
        xAxes: [{
          type: 'time',
          time: {
            unit: 'hour',
            unitStepSize: 1,
          },
          ticks: {
            min: '2019/11/13',
            max: currentTime,
          },
          gridLines: {
            display: false
          }
        }]
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'x'
          },
          zoom: {
            enabled: true,
            mode: 'x'
          },
        }
      }
    }
    const line_data = {
      labels: graphData.labels,
      datasets: [
        {
          label: 'Total members',
          fill: false,
          lineTension: 0.1,
          backgroundColor: '#39ff14',
          borderColor: '#39ff14',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#39ff14',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#39ff14',
          pointHoverBorderColor: '#39ff14',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: graphData.total_members,
          yAxisID: 'y-axis-1'
        },
        {
          label: 'Members Online',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: graphData.members_online,
          yAxisID: 'y-axis-2'
        },
        {
          label: 'Active members',
          fill: false,
          hidden: true,
          lineTension: 0.1,
          backgroundColor: '#8b0000',
          borderColor: '#8b0000',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#8b0000',
          pointBackgroundColor: '#808080',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#8b0000',
          pointHoverBorderColor: '#8b0000',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: graphData.members_active,
          yAxisID: 'y-axis-3'
        },
        {
          label: 'Message Count',
          fill: false,
          hidden: true,
          lineTension: 0.1,
          backgroundColor: '#00008b',
          borderColor: '#00008b',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#00008b',
          pointBackgroundColor: '#808080',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#00008b',
          pointHoverBorderColor: '#00008b',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          display: false,
          data: graphData.message_count,
          yAxisID: 'y-axis-4'
        }
      ]

    }

    if (this.state.mode === 'day') {
      options.scales.xAxes[0].time.unit = 'hour';
      options.scales.xAxes[0].ticks.min = this.getTime('hour');
    } else if (this.state.mode === 'month') {
      options.scales.xAxes[0].time.unit = 'day'
      options.scales.xAxes[0].ticks.min = this.getTime('month');
    } else if (this.state.mode === 'week') {
      options.scales.xAxes[0].time.unit = 'day'
      options.scales.xAxes[0].ticks.min = this.getTime('week');
    } else if (this.state.mode === 'all') {
      options.scales.xAxes[0].time.unit = 'day'
      options.scales.xAxes[0].ticks.min = this.getTime('all');
    }

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
                    <li className="breadcrumb-item">Coins</li>
                    <li className="breadcrumb-item "><a href="/dashboard"> Dashboard</a></li>
                    <li className="breadcrumb-item active">{graphData.name}</li>
                  </ol>
                </div>
                <h4 className="page-title"><img src={graphData.logo} alt="" />{graphData.name}</h4>
                <Table responsive style={{ width: '70%', margin: "auto" }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>ChatUrl</th>
                      <th>Total Members</th>
                      <th>Members online</th>
                      <th>Active Members</th>
                      <th>Messages Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {graphData.name}
                      </td>
                      <td>
                        {graphData.chatUrl}
                      </td>
                      <td>
                        {graphData.lastTotalMember}
                      </td>
                      <td>
                        {graphData.lastMembersOnline}
                      </td>
                      <td>
                        {graphData.lastMembersActive}
                      </td>
                      <td>
                        {graphData.lastMessageCount}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>

          </Row>

          <Row style={{ marginTop: "10px" }}>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Row>
                    <Col lg={8}></Col>
                    <Col lg={1}><h4><Badge style={{ backgroundColor: this.state.mode === 'all' ? '#35b8e0' : '#282e38' }} onClick={() => { this.setState({ mode: 'all' }) }}>All</Badge></h4></Col>
                    <Col lg={1}><h4><Badge style={{ backgroundColor: this.state.mode === 'day' ? '#35b8e0' : '#282e38' }} onClick={() => { this.setState({ mode: 'day' }) }} >24H</Badge></h4></Col>
                    <Col lg={1}><h4><Badge style={{ backgroundColor: this.state.mode === 'week' ? '#35b8e0' : '#282e38' }} onClick={() => { this.setState({ mode: 'week' }) }}>7D</Badge></h4></Col>
                    <Col lg={1}><h4><Badge style={{ backgroundColor: this.state.mode === 'month' ? '#35b8e0' : '#282e38' }} onClick={() => { this.setState({ mode: 'month' }) }} >30D</Badge></h4></Col>
                  </Row>
                  <Row>
                    <Col mg={12}>
                      <Line data={line_data} options={options} height={50} width={200} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { detailLoading, detailCoin } = state.coin;
  return {
    coin: detailCoin,
    loading: detailLoading,
  };
}

export default connect(mapStateToProps)(Coin);
