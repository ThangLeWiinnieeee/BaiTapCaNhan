import express from 'express';
import homeController from '../controllers/home.controller';

const router = express.Router();

const initWebRoutes = (app: express.Application) => {
  router.get('/', (req, res) => {
    return res.send('Nguyễn Hữu Trung');
  });

  router.get('/home', homeController.getHomePage);
  router.get('/crud', homeController.getCRUD);
  router.post('/post-crud', homeController.postCRUD);

  router.get('/get-crud', homeController.getFindAllCrud);
  router.get('/edit-crud', homeController.getEditCRUD);
  router.post('/put-crud', homeController.putCRUD);
  router.get('/delete-crud', homeController.deleteCRUD);

  return app.use('/', router);
};

export default initWebRoutes;