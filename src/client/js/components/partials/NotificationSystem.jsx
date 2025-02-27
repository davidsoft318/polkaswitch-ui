import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';
import TxQueue from '../../utils/txQueue';

import TxStatusView from './TxStatusView';

export default class NotificationSystem extends Component {
  constructor(props) {
    super(props);

    this.state = { refresh: Date.now(), closed: true };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.sub2 = EventManager.listenFor(
      'txSuccess', this.handleUpdate
    );
    this.sub2 = EventManager.listenFor(
      'txFailed', this.handleUpdate
    );
  }

  componentDidUnmount() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  handleUpdate(txNonce) {
    this.setState({
      refresh: Date.now(),
      closed: false,
      hash: txNonce
    });
  }

  handleClose(e) {
    this.setState({
      closed: true
    });
  }

  render() {
    var data = TxQueue.getTx(this.state.hash) || {};

    return (
      <div className={classnames("notification-drawer", {
        "is-hidden": this.state.closed || !data
      })}>
      <div className={classnames("notification", {
        "success": data.success,
        "failure": !data.success
      })}>
        <div className="level is-mobile">
          <div className="level-item">
            <TxStatusView data={data} success={data.success} />
          </div>
          <div className="level-item is-flex-grow-0">
            <span
              className="icon ion-icon clickable is-medium"
              onClick={this.handleClose}
            >
              <ion-icon name="close-outline"></ion-icon>
            </span>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

