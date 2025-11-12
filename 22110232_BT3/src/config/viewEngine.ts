import express from 'express';
import path from 'path';

const configViewEngine = (app: express.Application) => {
  app.use(express.static(path.join(__dirname, '../public')));
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));
};

export default configViewEngine;