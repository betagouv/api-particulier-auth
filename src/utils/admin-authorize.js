const authorize = function () {
  return (req, res, next) => {
    if (!req.session.roles.includes('api-particulier-token-admin')) {
      return res.sendStatus(403);
    }

    next();
  }
};

export default authorize;
