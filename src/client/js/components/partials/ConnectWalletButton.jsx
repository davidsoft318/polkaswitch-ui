import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';

export default class ConnectWalletButton extends Component {
  constructor(props) {
    super(props);
    this.state = { refresh: Date.now() };
    this.handleWalletChange = this.handleWalletChange.bind(this);
  }

  componentDidMount() {
    if (Wallet.isConnectedToAnyNetwork()) {
      Metrics.identify(Wallet.currentAddress());
    }

    this.subWalletChange = EventManager.listenFor(
      'walletUpdated', this.handleWalletChange
    );
  }

  componentDidUnmount() {
    this.subWalletChange.unsubscribe();
  }

  handleConnection(e) {
    EventManager.emitEvent('promptWalletConnect', 1);
  }

  handleWalletChange() {
    this.setState({ refresh: Date.now() });
  }

  getTruncWalletAddress() {
    var address = Wallet.currentAddress();
    var first = address.substring(0, 7);
    var last = address.substring(address.length - 5, address.length);
    return `${first}...${last}`;
  }

  renderButtonContent() {
    if (Wallet.isConnectedToAnyNetwork()) {
      return (
        <>
        <img className="image-icon" src="/images/metamask.png" />
        <span className="wallet-address">
          {this.getTruncWalletAddress()}
        </span>
        <span className="icon icon-arrow-down">
          <ion-icon name="chevron-down"></ion-icon>
        </span>
        </>
      );
    } else {
      return (
        <>
        <span>Connect Wallet</span>
        </>
      );
    }
  }

  render() {
    var isConnected = Wallet.isConnectedToAnyNetwork();

    return (
      <div className="wallet-status">
        <button
          className={classnames("button", {
            "is-white is-medium connected": isConnected,
            "is-primary": !isConnected
          })}
          onClick={this.handleConnection.bind(this)}
          aria-haspopup="true" aria-controls="dropdown-menu6">
          {this.renderButtonContent()}
        </button>
      </div>
    );
  }
}

