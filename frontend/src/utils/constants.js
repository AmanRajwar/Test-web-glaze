export const HOST = import.meta.env.VITE_SERVER_URL;
export const API =  'api/v1';
export const TEST = `${API}/test`;
export const LOGIN_ROUTE = `${API}/login`;
export const LOGOUT_ROUTE = `${API}/logout`;
export const GET_USER_INFO =  `${API}/get-user-by-token`;
export const ACTIVATE_ACCOUNT_ROUTE =  `${API}/activate-account`;
export const GET_ADMINS =  `${API}/super-user/get-all-admins`;
export const ADD_ADMIN_ROUTE =  `${API}/super-user/register-admin`;
export const DELETE_ADMIN_ROUTE =  (adminId)=>`${API}/super-user/delete-admin/${adminId}`;
export const GET_ADMIN_DETAILS_ROUTE =  (userId)=>`${API}/admin/get-details/${userId}`;
export const CREATE_TEAM_ROUTE =  `${API}/admin/create-team`;
export const DELETE_TEAM_ROUTE =(teamId)=>  `${API}/admin/team/${teamId}`;
export const ADD_TEAM_MEMBER = (teamId)=>`${API}/admin/register-member/${teamId}`;
export const GET_TEAM_MEMBERS = (teamId)=>`${API}/admin/get-team-members/${teamId}`;
export const DELETE_TEAM_MEMBERS = (teamId,userId)=>`${API}/admin/teams/${teamId}/users/${userId}`;
export const GET_USER_ROUTE = `${API}/user`;


