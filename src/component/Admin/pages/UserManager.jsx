import React from 'react';
import './UserManager.scss';

const UserManager = () => {
  return (
    <div className="admin-page user-manager">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage student accounts and OJT status</p>
      </div>

      <div className="card">
        <div className="search-bar">
          <input type="text" placeholder="Search by Student Code, Name..." />
          <select>
            <option>All Majors</option>
            <option>SE</option>
            <option>AI</option>
          </select>
          <button className="btn-secondary">Export List</button>
        </div>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student Code</th>
              <th>Name</th>
              <th>Major</th>
              <th>OJT Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SE123456</td>
              <td>Nguyen Van A</td>
              <td>Software Engineering</td>
              <td><span className="badge warning">Not Started</span></td>
              <td><button className="btn-primary">Impersonate</button></td>
            </tr>
            {/* More rows */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
