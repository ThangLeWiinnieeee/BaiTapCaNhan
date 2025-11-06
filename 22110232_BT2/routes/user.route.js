import express from "express";
import userController from "../controllers/userController.js";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', (req, res) => {
        return res.send('Nguyễn Hữu Trung');
    });
    
    router.get('/home', userController.getHomePage);
    router.get('/about', userController.getAboutPage);
    router.get('/crud', userController.getCRUD);
    router.post('/post-crud', userController.postCRUD);
    router.get('/get-crud', userController.getFindAllCrud);
    router.get('/edit-crud', userController.getEditCRUD);
    router.post('/put-crud', userController.putCRUD);
    router.get('/delete-crud', userController.deleteCRUD);

    return app.use("/", router);
};

export default initWebRoutes;