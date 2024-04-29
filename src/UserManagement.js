import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { firestore } from './firebase';
import { blockUser, unblockUser, deleteUser } from './userService';
import { collection, getDocs } from 'firebase/firestore';
import './UserManagement.css';
const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const snapshot = await getDocs(usersCollection);
        const userData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            lastLoginTime: new Date(data.lastLoginTime).toLocaleString(),
            registrationTime: new Date(data.registrationTime).toLocaleString()
          };
        });
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleBlockUser = async (userId) => {
    try {
      await blockUser(userId);
      setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, status: 'blocked' } : user));
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await unblockUser(userId);
      setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, status: 'active' } : user));
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="UserManagement">
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Email</th>
            <th>Last Login Time</th>
            <th>Registration Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><input type="checkbox" /></td>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.lastLoginTime}</td>
              <td>{user.registrationTime}</td>
              <td>{user.status}</td>
              <td>
                <Button variant="danger" onClick={() => handleBlockUser(user.id)}>Block</Button>
                <Button variant="success" onClick={() => handleUnblockUser(user.id)}>Unblock</Button>
                <Button variant="warning" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;