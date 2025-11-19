export const getHomePage = (req, res) => {
  return res.render('index', {
    title: 'FullStack App',
    message: 'Welcome to FullStack Express.js + ReactJS + MongoDB',
    user: req.user || null,
  });
};

export const getApiHome = (req, res) => {
  return res.json({
    EC: 0,
    EM: 'API is working',
    DT: {
      message: 'Welcome to FullStack API',
      user: req.user,
      timestamp: new Date().toISOString(),
    },
  });
};