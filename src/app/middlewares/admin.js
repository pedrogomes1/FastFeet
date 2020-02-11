export default async (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(401).json({
      error: "Usuário precisa ser administrador para acesso"
    });
  }

  return next();
};
