//popover shows 5 notifications when toggled
//notifications from api call based on logged in user
//onClick of button shows 10 more notifications with each click of button allowing scroll

import React from 'react';
import * as notificationsService from "../../services/notifications.service";
import { Popover, Overlay, ButtonToolbar } from 'react-bootstrap';
import "./NotificationsPopover.css"

const popoverStyle = {
  width: '300px',
  padding: '0',
  marginTop: '5px',
  backgroundColor: '#FFF',
  border: 'none',
  borderRadius: '3px',
  minHeight: '355px',
  overflow: 'hidden',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
  left: '1001px',
  top: '54px',
  position: 'absolute',

}

const dropdownHeader = {
  display: 'table',
  width: '100%',
  backgroundColor: '#F7F7F7',
  borderBottom: '1px solid #E6EBED',
  padding: '0 15px !important',
  height: '36px',
  lineHeight: '36px',
  color: '#5E5E5E',
  borderTopLeftRadius: '3px',
  borderTopRightRadius: '3px',
  fontSize: '13px',
  fontWeight: '600'
}
const scroll = {
  height: '537px',
  overflow: 'scroll'
}
class NotificationsPopover extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      notifications: [],
      notificationsCount: [],
      show: false,
      count: 5,
      isClicked: false,
    }
    this.showPopover = this.showPopover.bind(this)
    this.incrementNotifications = this.incrementNotifications.bind(this)
  }

  componentWillReceiveProps(futureProps) {

    if (futureProps.currentUser._id !== this.props.currentUser._id) {    
      notificationsService.readAllExt(`?startIndex=0&count=5`)
        .then(data => {         
          this.setState({ notifications: data })        
        })
    }

    if (futureProps.notifications !== this.props.notifications) {
      this.setState({
        notificationsCount: this.state.notificationsCount.concat(futureProps.notificationsCount),
        })
    }

    if (futureProps.currentUser._id !== this.props.currentUser._id) {
      notificationsService.readCount(`?startIndex=0`)      
        .then(data => {        
          this.setState({ notificationsCount: data.item })
        })             
    }
  }

  isReadBtn(e, event) {
    
//removing for brevity

  }

  showPopover = e => {
    this.setState({
      target: e.target,
      show: !this.state.show
    });
  }

  incrementNotifications = () => {
    const newCount = this.state.count + 10

    notificationsService.readAllExt(`?startIndex=0&count=${newCount}`)
      .then(data => {
        this.setState({ notifications: data })
      })
    this.setState({ count: newCount })
  }

  render() {
    const notifications = this.state.notifications && this.state.notifications.map(e => {
      const icon = {
        announcement: "fa-bullhorn",
        application: "fa-exclamation-triangle"
      }

      return (
        <a key={e._id} href={null} className="media" style={{ "display": "table" }}>
          <div className="pull-left">
            <i className={`media-object notification-icon fa ${icon[e.notificationType]} fg-info `}></i>
          </div>
          <div className="media-body">
            <span className="media-heading"><strong>{e.title}</strong></span>
            {e.notificationType === "application" &&
              <span className="media-text">
                Status has been updated to {e.status}
              </span>
            }
            <button
              type="button"
              className={"btn btn-xs rounded " + (this.state.isClicked ? 'btn-success' : ' btn-info ')}
              onClick={event => this.isReadBtn(e, event)}
            > Mark Read
            </button>
          </div>

        </a>

      );
    })

    return (
      <React.Fragment >
        <a href={null} onClick={this.showPopover}>
          <i className="fa fa-bell-o"></i>
          <span className="rounded count label label-danger">{this.state.notificationsCount}</span>
        </a>

        <ButtonToolbar>
          <Overlay
            show={this.state.show}
            target={this.state.target}
            onHide={() => this.setState({ show: false })}
            rootClose="true"
            placement="bottom"
            className="popover-content"
          >
            <Popover id="notification-popover" className="dropdown-menu animated flipInX" positionTop="38px"
              positionLeft="-220px" style={popoverStyle}>
              <div className="dropdown-header" style={dropdownHeader}>
                <span className="title">
                  Notifications
              <strong> ({this.state.notificationsCount})</strong>
                </span>
                <span className="notification-right-header">
                  <a href={null}>
                    <i className="fa fa-cog"></i>
                    Setting
                  </a>
                </span>
              </div>
              <div className="row">
                <div className="dropdown-body niceScroll" style={scroll}>
                  <div className="media-list small"> {notifications}</div>
                </div>
              </div>
              <div className="notification-footer" >
                <a onClick={this.incrementNotifications} href={null}> Show 10 More </a>
              </div>
            </Popover>
          </Overlay>
        </ButtonToolbar>

      </React.Fragment >
    )
  }
}
export default NotificationsPopover; 
