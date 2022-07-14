import axios from 'axios';
import authHeader from './auth-header';
const API_URL = 'http://localhost:3000/api/user/';
class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }
  getUserBoard() {
    return axios.get(API_URL + 'users', { headers: authHeader() });
  }
  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
  getSuperAdminBoard() {
    return axios.get(API_URL + 'superadmin', { headers: authHeader() });
  }
}
export default new UserService();
