// Pegar o usuário logado, quando ele faz o login, é gerado o token, que faz a autenticação
// O token vai pelo header da requisição
import jwt from "jsonwebtoken";
import { promisify } from "util"; // Transforma funcao de callback em async await (+ por causa do verify)
import authConfig from "../../config/auth";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization; // Recupero o token do usuário logado

  if (!authHeader) {
    return res.status(401).json({ error: "token não utilizado" });
  }

  const [, token] = authHeader.split(" "); // Eu tiro o texto BEARER que vem por padrão no token do authorization

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // No método jwt.sign, é passado o ID do usuário, esse decoded consegue receber todas as info do jwt.sign

    // eu passo para requisição o id, assim no método de atualizar eu recupero pelo req.userId e não
    // preciso passar o id pela rota
    req.userId = decoded.id;
    req.isAdmin = decoded.admin;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalido" });
  }
};
