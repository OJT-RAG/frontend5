import React from 'react';
import './SemesterManager.scss';

const SemesterManager = () => {
  return (
    <div className="admin-page semester-manager">
      <div className="page-header">
        <h1>Semester Management</h1>
        <p>Manage OJT semesters and timelines</p>
      </div>

      <div className="card">
        <div className="toolbar">
          <button className="btn-primary">Create New Semester</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Spring 2025</td>
              <td>2025-01-05</td>
              <td>2025-04-30</td>
              <td><span className="badge active">Active</span></td>
              <td><button>Edit</button></td>
            </tr>
            <tr>
              <td>Fall 2024</td>
              <td>2024-09-05</td>
              <td>2024-12-30</td>
              <td><span className="badge closed">Closed</span></td>
              <td><button>View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SemesterManager;
