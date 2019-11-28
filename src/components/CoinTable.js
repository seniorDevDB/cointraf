import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { withRouter } from 'react-router';
import { coinActions } from '../_actions';
import fetchDataFromDatabase from './fetchDatas.js';
import '../assets/css/SearchBar.css';

var moment = require('moment');

class CoinTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            coins: [],
            graphCoin: null,
            chartMode: 'all',
            sort: {
                name: 1,
                symbol: 1,
                memberCount: 1,
                membersActive: 1,
                membersOnline: 1,
                dayChange7: 1,
                messageCount: 1,
            },
            sortType: 'memberCount',
            loading: true,
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const { loadStatus, coins } = this.props;
        if (loadStatus === undefined) {
            fetchDataFromDatabase().then(coins => {
                console.log(coins);
                this.setState({ coins });
                this.props.dispatch(coinActions.saveCoin(coins));
                this.setState({ loading: false });
            });
        } else {
            this.setState({
                coins: coins
            })
            this.setState({ loading: false });
        }

    }

    getTotalMembersData = () => {
        const coin = this.state.graphCoin
        if (coin && coin.data && coin.data.length > 0) {
            const coinData = [];
            for (var i = 0; i < coin.data.length; i++) {
                const data = coin.data[i];
                coinData.push({
                    x: new Date(data.date),
                    y: data.memberCount
                })
            }
            return coinData
        }
    }

    getMembersOnlineData = () => {
        const coin = this.state.graphCoin
        if (coin && coin.data && coin.data.length > 0) {
            const coinData = [];
            for (var i = 0; i < coin.data.length; i++) {
                const data = coin.data[i];
                coinData.push({
                    x: new Date(data.date),
                    y: data.membersOnline
                })
            }
            return coinData
        }
    }

    coinClicked(coin) {
        this.setState({ graphCoin: coin })
    }

    render() {
        const coins = this.state.coins;

        if(this.state.loading)
            return( <div className="lds-dual-ring"></div>)
        return (

            <Table responsive>
                <thead>
                    <tr>
                        <th onClick={() => {
                            this.setState({ sortType: 'name', sort: { ...this.state.sort, name: (this.state.sort.name === 1 ? -1 : 1) } });
                        }}>
                            NAME
            </th>
                        <th onClick={() => {
                            this.setState({ sortType: 'symbol', sort: { ...this.state.sort, symbol: (this.state.sort.symbol === 1 ? -1 : 1) } });
                        }}>
                            SYMBOL
            </th>
                        <th onClick={() => {
                            this.setState({ sortType: 'memberCount', sort: { ...this.state.sort, memberCount: (this.state.sort.memberCount === 1 ? -1 : 1) } });
                        }}>
                            Total Member
            </th>
                        <th onClick={() => {
                            this.setState({ sortType: 'membersActive', sort: { ...this.state.sort, membersActive: (this.state.sort.membersActive === 1 ? -1 : 1) } });
                        }}>
                            Active Member
            </th>
                        <th onClick={() => {
                            this.setState({ sortType: 'membersOnline', sort: { ...this.state.sort, membersOnline: (this.state.sort.membersOnline === 1 ? -1 : 1) } });
                        }}>
                            Online Member
            </th>
                        <th onClick={() => {
                            this.setState({ sortType: 'dayChange7', sort: { ...this.state.sort, dayChange7: (this.state.sort.dayChange7 === 1 ? -1 : 1) } });
                        }}>7D Member</th>
                        <th onClick={() => {
                            this.setState({ sortType: 'messageCount', sort: { ...this.state.sort, messageCount: (this.state.sort.messageCount === 1 ? -1 : 1) } });
                        }}>24h Message</th>
                    </tr>
                </thead>
                <tbody>
                    {coins.sort((a, b) => {
                        const x = a[this.state.sortType];
                        const y = b[this.state.sortType];
                        const f = this.state.sort[this.state.sortType];
                        if ((x < y && f === 1) || (x > y && f === -1))
                            return 1;
                        return -1;
                    }).map((coin, index) => (
                        <tr onClick={
                            () => {
                                this.props.history.push({
                                    pathname: `/coin/${coin.name}`,
                                    state: { coinData: coin },
                                    target: '_blank'
                                })
                            }
                        } key={index}>
                            <td>
                                <img src={coin.logo} /> {coin.name}
                            </td>
                            <td>{coin.symbol}</td>
                            <td>{coin.memberCount}</td>
                            <td>{coin.membersActive}</td>
                            <td>{coin.membersOnline}</td>
                            {coin.dayChange7 >= 0 ?
                                <td><i style={{ color: '#39FF14' }} className="mdi mdi-menu-up">{`+${coin.dayChange7}`}</i></td>
                                :
                                <td><i style={{ color: 'red' }} className="mdi mdi-menu-down">{coin.dayChange7}</i></td>
                            }
                            {coin.messageCount >= 0 ?
                                <td><i style={{ color: '#39FF14' }} className="mdi mdi-menu-up">{`+${coin.messageCount}`}</i></td>
                                :
                                <td><i style={{ color: 'red' }} className="mdi mdi-menu-down">{coin.messageCount}</i></td>
                            }

                            {/* <td style={ coin.dayChange30 ? coin.dayChange30.charAt(0) === "+" ? { color: '#39FF14'} :{ color: 'red'} : { color: 'gray'}  }>
                <i className="mdi mdi-menu-down">{coin.dayChange30}</i>
            </td> */}

                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }
}

function mapStateToProps(state) {
    const { detailLoading, detailCoin } = state.coin;
    return {
        coins: detailCoin,
        loadStatus: detailLoading,
    };
}
export default connect(mapStateToProps)(withRouter(CoinTable))
