import User from '../models/user.model';
// Không cần import bcrypt ở đây nữa, vì model đã tự xử lý

const createNewUser = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Password đã được hash tự động bởi Mongoose middleware (model)
      await User.create({
        email: data.email,
        password: data.password,
        firstName: data.firstName, 
        lastName: data.lastName, 
        address: data.address, 
        phoneNumber: data.phoneNumber,
        gender: data.gender === '1',
        roleId: data.roleId,
      });
      resolve('OK create a new user successful');
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // .lean() để chuyển Mongoose Document thành Plain Object (giống 'raw: true' [cite: 555])
      const users = await User.find({}).lean(); 
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

const getUserInfoById = (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Mongoose dùng findById
      const user = await User.findById(userId).lean();
      if (user) {
        resolve(user); 
      } else {
        resolve([]); 
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Mongoose có findByIdAndUpdate tiện lợi hơn
      const user = await User.findByIdAndUpdate(data.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address
      }, { new: true }).lean(); // {new: true} để trả về document đã update

      if (user) {
        resolve(user); 
      } else {
        resolve('User not found');
      }
      // Lấy lại toàn bộ danh sách 
      // let allUsers = await User.find({}).lean();
      // resolve(allUsers);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUserById = (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.findByIdAndDelete(userId);
      resolve('Delete success');
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUser,
  deleteUserById
};