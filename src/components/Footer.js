import React, { Component } from 'react';

/**
 * Renders the Footer
 */
class Footer extends Component {

    render() {
        return (
            <footer className="footer">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            2016 - 2019 &copy; <a href="https://vradars.com/">Coin Traf</a>
                        </div>
                        <div className="col-md-6">
                            <div className="text-md-right footer-links d-none d-sm-block">
                                <a href="https://vradars.com/">About Us</a>
                                <a href="https://vradars.com/">Help</a>
                                <a href="https://vradars.com/">Contact Us</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer;
