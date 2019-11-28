import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import logoSm from '../assets/images/logo-sm.png';
import logo from '../assets/images/logo-light.png';
import profilePic from '../assets/images/users/user-1.jpg';
import '../assets/css/SearchBar.css';

const Notifications = [{
  id: 1,
  text: 'Caleb Flakelar commented on Admin',
  subText: '1 min ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'primary'
},
{
  id: 2,
  text: 'New user registered.',
  subText: '5 min ago',
  icon: 'mdi mdi-account-plus',
  bgColor: 'info'
},
{
  id: 3,
  text: 'Cristina Pride',
  subText: 'Hi, How are you? What about our next meeting',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'success'
},
{
  id: 4,
  text: 'Caleb Flakelar commented on Admin',
  subText: '2 days ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'danger'
},
{
  id: 5,
  text: 'Caleb Flakelar commented on Admin',
  subText: '1 min ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'primary'
},
{
  id: 6,
  text: 'New user registered.',
  subText: '5 min ago',
  icon: 'mdi mdi-account-plus',
  bgColor: 'info'
},
{
  id: 7,
  text: 'Cristina Pride',
  subText: 'Hi, How are you? What about our next meeting',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'success'
},
{
  id: 8,
  text: 'Caleb Flakelar commented on Admin',
  subText: '2 days ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'danger'
}];

const ProfileMenus = [{
  label: 'My Account',
  icon: 'fe-user',
  redirectTo: "/",
},
{
  label: 'Settings',
  icon: 'fe-settings',
  redirectTo: "/"
},
{
  label: 'Lock Screen',
  icon: 'fe-lock',
  redirectTo: "/"
},
{
  label: 'Logout',
  icon: 'fe-log-out',
  redirectTo: "/logout",
  hasDivider: true
}]


class Topbar extends Component {
  constructor(props) {
    super(props);

    //test          you can put data here;
    this.items = [];

    this.state = {
      coins: [],
      searchText: '',
      items: [],
    };
  }

  onTextChanged = (e) => {
    const { dispatch } = this.props;
    const { loadStatus, coins } = this.props;

    if (loadStatus === undefined) {
      
    } else {
      const value = e.target.value;
      let sortedCoins = [];
      if (value.length > 0) {
        const regex = new RegExp(`^${value}`, 'i');
        sortedCoins = coins.sort((a, b) => (a.name > b.name) ? 1 : -1).filter(v => regex.test(v.name));
      }
      this.setState({ coins: sortedCoins, searchText: value });
    }
}

  coinSelected(coin) {
    console.log(coin);
    this.props.history.push({
      pathname : `/coin/${coin.name}`,
      state : { coinData : {...coin} },
      target : '_blank'
    })
    this.setState(() => ({
      searchText: coin.name,
      coins: [],
    }));
  }

  renderSearch() {
    const { coins } = this.state;
    if (coins.length === 0) {
      return null;
    }
    return (
      <div className="seach-results">
        <div className="item-header">{"Coins"}</div>
        {
          coins.map((item) => 
            <div
              key={item.name}
              className="item"
              onClick={() => this.coinSelected(item)}
            >
              <img src={item.logo} alt="Icon" className="icon" />
              <span>{item.name}</span>
            </div>
          )
        }
      </div>
    );
  }

  render() {
    const { searchText } = this.state;
    return (
      <React.Fragment>
        <div className="navbar-custom">
          <div className="container-fluid">
            <ul className="list-unstyled topnav-menu float-right mb-0">

              <li className="dropdown notification-list">
                <Link className={classNames('navbar-toggle', 'nav-link', { 'open': this.props.isMenuOpened })} to="#" onClick={this.props.menuToggle}>
                  <div className="lines">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </Link>
              </li>

              <li className="d-none d-sm-block">
                <form className="app-search">
                  <div className="app-search-box">
                    <div className="input-group">
                      <input value={searchText} type="text" onChange={this.onTextChanged} className="form-control" placeholder="Search..." />
                      <div className="input-group-append">
                        <button className="btn" type="submit">
                          <i className="fe-search"></i>
                        </button>
                      </div>
                    </div>
                    <div>
                      {this.renderSearch()}
                    </div>
                  </div>
                </form>
              </li>

              {/* <li className="dropdown notification-list">
                <button className="btn btn-link nav-link right-bar-toggle waves-effect waves-light" onClick={this.props.rightSidebarToggle}>
                  <i className="fe-settings noti-icon"></i>
                </button>
              </li> */}
            </ul>

            <div className="logo-box">
              <Link to="/" className="logo text-center">
                <span className="logo-lg">
                  <img src={logo} alt="" height="16" />
                </span>
                <span className="logo-sm">
                  <img src={logoSm} alt="" height="24" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </React.Fragment >
    );
  }
}

function mapStateToProps(state) {
  const { detailLoading, detailCoin } = state.coin;
  return {
    coins: detailCoin,
    loadStatus: detailLoading,
  };
}

export default connect(mapStateToProps)(Topbar);
