import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Firebase Firestore functions
import {
    collection,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
} from 'firebase/firestore';
import { getAuth, updateEmail } from 'firebase/auth';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import './AdminPanel.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const SideNavbar = ({ onMenuSelect, activeMenu }) => (
    <div className="side-navbar">
        <h3>Admin Panel</h3>
        <ul>
            <li
                className={activeMenu === 'dashboard' ? 'active' : ''}
                onClick={() => onMenuSelect('dashboard')}
            >
                Dashboard
            </li>
            <li
                className={activeMenu === 'users' ? 'active' : ''}
                onClick={() => onMenuSelect('users')}
            >
                Manage Users
            </li>
            <li
                className={activeMenu === 'settings' ? 'active' : ''}
                onClick={() => onMenuSelect('settings')}
            >
                Settings
            </li>
            <li
                className={activeMenu === 'logout' ? 'active' : ''}
                onClick={() => onMenuSelect('logout')}
            >
                Logout
            </li>
        </ul>
    </div>
);

const AdminPanel = ({ userDetails }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedPhone, setUpdatedPhone] = useState('');
    const [adminCount, setAdminCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [activeMenu, setActiveMenu] = useState('users');

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (querySnapshot) => {
            const userList = [];
            let admins = 0;
            let regularUsers = 0;

            querySnapshot.forEach((doc) => {
                const userData = { ...doc.data(), id: doc.id };
                userList.push(userData);
                if (userData.isAdmin) {
                    admins += 1;
                } else {
                    regularUsers += 1;
                }
            });

            setUsers(userList);
            setAdminCount(admins);
            setUserCount(regularUsers);
        });

        return () => unsubscribe();
    }, []);
    const handleLogout = async () => {
        try {
            await signOut(auth); // Log out the user
            toast.success('Logged out successfully!');
            if (onLogout) onLogout(); // Optional callback to handle navigation
        } catch (error) {
            toast.error('Failed to log out. Please try again.');
        }
    };

    useEffect(() => {
        if (activeMenu === 'logout') {
            handleLogout();
        }
    }, [activeMenu]);

    const updateUserDetails = async () => {
        if (!updatedName || !updatedEmail) {
            toast.error('Name and Email are required!');
            return;
        }

        const userRef = doc(db, 'users', selectedUser.id);
        await updateDoc(userRef, { name: updatedName, email: updatedEmail, phone: updatedPhone });

        if (auth.currentUser && auth.currentUser.email === selectedUser.email) {
            try {
                await updateEmail(auth.currentUser, updatedEmail);
                toast.success('Email updated in authentication system.');
            } catch (error) {
                toast.error('Error updating email in authentication system.');
            }
        }

        toast.success('User details updated successfully!');
        setSelectedUser(null);
        setUpdatedName('');
        setUpdatedEmail('');
        setUpdatedPhone('');
    };

    const updateUserRole = async (userId, newRole) => {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { isAdmin: newRole === 'Admin' });
        toast.success(`${newRole === 'Admin' ? 'Made' : 'Revoked'} user admin role.`);
    };

    const deleteUser = async (userId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this user?');
        if (isConfirmed) {
            const userRef = doc(db, 'users', userId);
            await deleteDoc(userRef);
            toast.success('User deleted successfully!');
        }
    };

    // Bar Chart (User Distribution by Role)
    const chartOptionsBar = {
        responsive: true,
        animations: {
            tension: {
                duration: 1000,
                easing: 'easeInOutQuad',
                from: 1,
                to: 0,
                loop: true,
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'User Distribution by Role',
                font: {
                    size: 18, // Increase font size for title
                },
            },
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14, // Increase font size for legend labels
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Roles',
                    font: {
                        size: 16, // Increase font size for X-axis title
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'User Count',
                    font: {
                        size: 16, // Increase font size for Y-axis title
                    },
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 1, // Prevent decimals
                    font: {
                        size: 14, // Increase font size for Y-axis labels
                    },
                },
            },
        },
    };

    const chartDataBar = {
        labels: ['Admins', 'Users'],
        datasets: [
            {
                label: 'User Count',
                data: [adminCount, userCount],
                backgroundColor: ['#8e44ad', '#3498db'], // Custom color scheme
                borderColor: ['#8e44ad', '#3498db'],
                borderWidth: 1,
            },
        ],
    };

    // Pie Chart (User Distribution by Role)
    const chartOptionsPie = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Role Distribution',
                font: {
                    size: 18, // Increase font size for title
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const percentage = tooltipItem.raw;
                        return `${tooltipItem.label}: ${percentage}%`;
                    },
                },
            },
        },
    };

    const chartDataPie = {
        labels: ['Admins', 'Users'],
        datasets: [
            {
                data: [(adminCount / (adminCount + userCount)) * 100, (userCount / (adminCount + userCount)) * 100],
                backgroundColor: ['#f39c12', '#2ecc71'],
                hoverBackgroundColor: ['#f39c12', '#2ecc71'],
            },
        ],
    };

    return (
        <div className="admin-panel-container">
            <SideNavbar
                onMenuSelect={setActiveMenu}
                activeMenu={activeMenu}
            />
            <div className="admin-panel-content">
                <h2 className="welcome-message">Welcome, {userDetails?.name || 'Admin'}!</h2>
                {activeMenu === 'dashboard' && (
                    <div>
                        <div className="chart-section">
                            <h4>User Distribution (Pie Chart)</h4>
                            <div className="chart-container">
                                <Pie data={chartDataPie} options={chartOptionsPie} />
                            </div>
                        </div>
                        <div className="chart-section">
                            <h4>User Distribution by Role (Bar Chart)</h4>
                            <div className="chart-container">
                                <Bar data={chartDataBar} options={chartOptionsBar} />
                            </div>
                        </div>
                    </div>
                )}
                {activeMenu === 'users' && (
                    <div>
                        <h2 className="manage-users-title">Manage Users</h2>
                        <div className="user-table">
                            <div className="user-table-header">
                                <span>Name</span>
                                <span>Email</span>
                                <span>Phone</span>
                                <span>Role</span>
                                <span>Actions</span>
                            </div>
                            <ul>
                                {users.map((user) => (
                                    <li key={user.id} className="user-row">
                                        <span>{user.name}</span>
                                        <span>{user.email}</span>
                                        <span>{user.phone || 'N/A'}</span>
                                        <span className={user.isAdmin ? 'admin' : 'user'}>
                                            {user.isAdmin ? 'Admin' : 'User'}
                                        </span>
                                        <span className="actions">
                                            <button
                                                className="update-btn"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setUpdatedName(user.name);
                                                    setUpdatedEmail(user.email);
                                                    setUpdatedPhone(user.phone || '');
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="role-btn"
                                                onClick={() => updateUserRole(user.id, user.isAdmin ? 'User' : 'Admin')}
                                            >
                                                {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {selectedUser && (
                            <div className="update-user-form">
                                <h4>Update User Details</h4>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={updatedEmail}
                                    onChange={(e) => setUpdatedEmail(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Phone (optional)"
                                    value={updatedPhone}
                                    onChange={(e) => setUpdatedPhone(e.target.value)}
                                />
                                <button onClick={updateUserDetails}>Update User</button>
                            </div>
                        )}
                    </div>
                )}
                <ToastContainer />
            </div>
        </div>
    );
};

export default AdminPanel;
