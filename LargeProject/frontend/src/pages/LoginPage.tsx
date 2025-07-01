import React from 'react';
import Header from '../components/Header';
const LoginPage = () =>
{
    return (
    <>
      <div>
        <Header />
      </div>
      <div>
        <div className="page-container">
          <div className="custom-card">
            <h1 className="card-title">Please login below</h1>
            <form className="card-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" id="username" placeholder="Enter username" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Enter password" />
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;