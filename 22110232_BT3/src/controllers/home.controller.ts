import { Request, Response } from 'express';
import CRUDService from '../services/CRUDService';

const getHomePage = async (req: Request, res: Response) => {
  try {
    // let data = await db.User.findAll();
    // return res.render('homepage.ejs', {
    //   data: JSON.stringify(data)
    // });
    return res.render('homepage.ejs');
  } catch (e) {
    console.log(e);
  }
};

const getAboutPage = (req: Request, res: Response) => {
  return res.render('test/about.ejs');
};

const getCRUD = (req: Request, res: Response) => {
  return res.render('crud.ejs');
};

const postCRUD = async (req: Request, res: Response) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message); 
  return res.send('Post crud to server'); 
};

const getFindAllCrud = async (req: Request, res: Response) => {
  let data = await CRUDService.getAllUser();
  return res.render('users/findAllUser.ejs', {
    datalist: data 
  });
};

const getEditCRUD = async (req: Request, res: Response) => {
  let userId = req.query.id as string; 
  if (userId) {
    let userData = await CRUDService.getUserInfoById(userId); 
    return res.render('users/editUser.ejs', { 
      data: userData 
    });
  } else {
    return res.send('không lấy được id');
  }
};

const putCRUD = async (req: Request, res: Response) => {
  let data = req.body;
  await CRUDService.updateUser(data);
  // Sau khi update, ta nên redirect về trang /get-crud
  return res.redirect('/get-crud');
};

const deleteCRUD = async (req: Request, res: Response) => {
  let id = req.query.id as string; 
  if (id) {
    await CRUDService.deleteUserById(id);
    return res.send('Deleted!!!!!!!!!!!!'); 
  } else {
    return res.send('Not find user');
  }
};

export default {
  getHomePage,
  getAboutPage,
  getCRUD,
  postCRUD,
  getFindAllCrud,
  getEditCRUD,
  putCRUD,
  deleteCRUD
};