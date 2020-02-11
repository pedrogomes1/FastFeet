import jwt from "jsonwebtoken";
import * as Yup from "yup";
import User from "../models/User";
import authConfig from "../../config/auth";

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ message: "Validation fails" });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ message: "Check your password" });
    }

    const { id, name, password_hash, admin } = user;

    return res.json({
      user: {
        id,
        name,
        password_hash,
        admin
      },
      // Primeiro parametro é o payload, o segundo é a assinatura
      token: jwt.sign({ id, admin }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessionController();
