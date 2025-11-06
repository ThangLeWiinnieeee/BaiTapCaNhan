import { User } from '../models/index.js';
import CRUDService from '../services/CRUDService.js';

let getHomePage = async (req, res) => {
    try {
        let data = await User.find({});
        console.log('......');
        console.log(data);
        console.log('......');
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send('Error occurred');
    }
};

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
};

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
};

let getFindAllCrud = async (req, res) => {
    try {
        let data = await CRUDService.getAllUser();
        return res.render('users/findAllUser.ejs', {
            datalist: data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error occurred');
    }
};

let postCRUD = async (req, res) => {
    try {
        let message = await CRUDService.createNewUser(req.body);
        console.log(message);
        return res.send('Post crud to server');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error occurred');
    }
};

let getEditCRUD = async (req, res) => {
    try {
        let userId = req.query.id;
        if (userId) {
            let userData = await CRUDService.getUserInfoById(userId);
            return res.render('users/editUser.ejs', {
                data: userData
            });
        } else {
            return res.send('không lấy được id');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error occurred');
    }
};

let putCRUD = async (req, res) => {
    try {
        let data = req.body;
        let updatedData = await CRUDService.updateUser(data);
        return res.render('users/findAllUser.ejs', {
            datalist: updatedData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error occurred');
    }
};

let deleteCRUD = async (req, res) => {
    try {
        let id = req.query.id;
        if (id) {
            await CRUDService.deleteUserById(id);
            return res.send('Deleted!!!!!!!!!!!!!');
        } else {
            return res.send('Not find user');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error occurred');
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