import React, { useEffect, useState } from 'react';
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css"
import { db } from './firebase'; // Firebase Firestore functions
import {
    collection,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
    addDoc
} from 'firebase/firestore';
import { getAuth, updateEmail, signOut } from 'firebase/auth';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
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
                className={activeMenu === 'venue' ? 'active' : ''}
                onClick={() => onMenuSelect('venue')}
            >
                Venue
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
    const [venueTitle, setVenueTitle] = useState('');
    const [venueDescription, setVenueDescription] = useState('');
    const [venueRent, setVenueRent] = useState('');
    const [venueLocation, setVenueLocation] = useState('');
    const [venueImage, setVenueImage] = useState('');
    const [minGuests, setMinGuests] = useState('');
    const [rooms, setRooms] = useState('');
    const [adminCount, setAdminCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [activeMenu, setActiveMenu] = useState('users');

    const auth = getAuth();
    const [venues, setVenues] = useState([]);


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

        const unsubscribeVenues = onSnapshot(collection(db, 'venues'), (querySnapshot) => {
            const venueList = [];
            querySnapshot.forEach((doc) => {
                const venueData = { ...doc.data(), id: doc.id };
                venueList.push(venueData);
            });
            setVenues(venueList);
        });

        return () => {
            unsubscribe();
            unsubscribeVenues();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out successfully!');
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

    const createVenue = async () => {
        if (!venueTitle || !venueDescription || !venueRent || !venueLocation || !venueImage || !minGuests || !rooms) {
            toast.error('All fields are required!');
            return;
        }

        try {
            await addDoc(collection(db, 'venues'), {
                title: venueTitle,
                description: venueDescription,
                rent: venueRent,
                location: venueLocation,
                image: venueImage,
                minGuests: parseInt(minGuests, 10),
                rooms: parseInt(rooms, 10),
                createdAt: new Date(),
            });

            toast.success('Venue created successfully!');
            setVenueTitle('');
            setVenueDescription('');
            setVenueRent('');
            setVenueLocation('');
            setVenueImage('');
            setMinGuests('');
            setRooms('');
        } catch (error) {
            toast.error('Failed to create venue. Please try again.');
        }
    };

    const deleteVenue = async (venueId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this venue?');
        if (isConfirmed) {
            try {
                await deleteDoc(doc(db, 'venues', venueId));
                toast.success('Venue deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete venue.');
            }
        }
    };

    // Bar Chart (User Distribution by Role)
    const chartOptionsBar = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'User Distribution by Role',
                font: {
                    size: 18,
                },
            },
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
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
                        size: 16,
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'User Count',
                    font: {
                        size: 16,
                    },
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                    font: {
                        size: 14,
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
                backgroundColor: ['#8e44ad', '#3498db'],
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
                    size: 18,
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
            <SideNavbar onMenuSelect={setActiveMenu} activeMenu={activeMenu} />
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
                                <h3>Update User Details</h3>
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
                                    placeholder="Phone"
                                    value={updatedPhone}
                                    onChange={(e) => setUpdatedPhone(e.target.value)}
                                />
                                <button onClick={updateUserDetails}>Update User</button>
                                <button onClick={() => setSelectedUser(null)}>Cancel</button>
                            </div>
                        )}
                    </div>
                )}
                {activeMenu === 'venue' && (
                    <div className="venue-form-container">
                        <h2>Create Venue</h2>
                        <input
                            type="text"
                            placeholder="Venue Title"
                            className="form-control mb-3"
                            value={venueTitle}
                            onChange={(e) => setVenueTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Venue Description"
                            className="form-control mb-3"
                            value={venueDescription}
                            onChange={(e) => setVenueDescription(e.target.value)}
                        />
                        <input
                        type="number"
                        placeholder="Minimum Guests"
                        className="form-control mb-3"
                        value={minGuests}
                        onChange={(e) => setMinGuests(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Number of Rooms"
                        className="form-control mb-3"
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)}
                    />
                        <input
                            type="number"
                            placeholder="Rent"
                            className="form-control mb-3"
                            value={venueRent}
                            onChange={(e) => setVenueRent(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            className="form-control mb-3"
                            value={venueLocation}
                            onChange={(e) => setVenueLocation(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            className="form-control mb-3"
                            value={venueImage}
                            onChange={(e) => setVenueImage(e.target.value)}
                        />
                        <button className="btn btn-primary mb-4" onClick={createVenue}>
            Create Venue
        </button>
                        

        
                    </div>
                )}
                <ToastContainer position="top-right" autoClose={5000} />
            </div>
        </div>
    );
};

export default AdminPanel;
