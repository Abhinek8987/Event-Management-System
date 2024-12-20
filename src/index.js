import React from 'react';
import ReactDOM from 'react-dom';
import AdminPanel from './AdminPanel';
import './index.css'; // Optional: Include global styles if any.

ReactDOM.render(
    <React.StrictMode>
        <AdminPanel userDetails={{ name: "Admin" }} />
    </React.StrictMode>,
    document.getElementById('root')
);
