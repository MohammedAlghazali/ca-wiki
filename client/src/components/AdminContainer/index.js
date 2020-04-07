import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout, Button, Menu } from 'antd';
import logo from '../../assets/images/logo.png';
import './style.css';

const { Header } = Layout;

const AdminContainer = ({ children, buttonContent }) => {
  return (
    <>
      <Layout>
        <Header>
          <div className="admin-header-image">
            <img src={logo} alt="logo" />
          </div>
          <div className="admin-header-btn">
            {buttonContent !== undefined && (
              <Button type="primary" danger>
                {buttonContent}
              </Button>
            )}
          </div>
        </Header>
        <div className="admin-container">
          <div className="adin-container-side">
            <div className="admin-side">
              <Menu>
                <Menu.Item key="1">
                  <Link to="/admin">Home</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/admin/cohorts">Cohorts</Link>
                </Menu.Item>
              </Menu>
              <div className="admin-side-btn">
                <Button type="primary" danger>
                  Logout
                </Button>
              </div>
            </div>
          </div>
          <div className="admin-content">{children}</div>
        </div>
      </Layout>
    </>
  );
};

AdminContainer.defaultProps = { buttonContent: 'add cohort', children: 'test' };

AdminContainer.propTypes = {
  buttonContent: PropTypes.string,
  children: PropTypes.string,
};

export default AdminContainer;
