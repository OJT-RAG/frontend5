// src/api/userApi.js
import httpClient from "./httpClient";

const userApi = {
  // Cập nhật user
  update: (data) => httpClient.post("/user/update", data),

  // Lấy thông tin user theo ID
  getById: (userId) => httpClient.get(`/user/${userId}`),

  getAll: () => httpClient.get("/user/getAll"),

  create: (data) => httpClient.post("/user/create", data),

  login: (data) => httpClient.post("/user/login", data),  
};

export default userApi;