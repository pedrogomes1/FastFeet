import * as Yup from "yup";
import Deliveryman from "../models/Deliveryman";

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(2),
      email: Yup.string()
        .email()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: "Validations fails" });
    }
    const { name, email } = req.body;

    // Verificar se já existe um e-mail cadastrado
    const deliverymanEmail = await Deliveryman.findOne({
      where: { email }
    });

    if (deliverymanEmail) {
      return res.status(401).json("Email já cadastrado");
    }

    const deliveryman = await Deliveryman.create({
      name,
      email
    });

    return res.json(deliveryman);
  }

  async index(req, res) {
    const deliveryman = await Deliveryman.findAll();

    return res.json(deliveryman);
  }

  async update(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json("User not found");
    }

    const schema = Yup.object().shape({
      email: Yup.string().email(),
      name: Yup.string(),
      avatar_id: Yup.number().positive()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json("Validation fails");
    }

    const avatarExists = await Deliveryman.findOne({
      where: { avatar_id: req.body.avatar_id }
    });

    if (avatarExists) {
      return res.status(400).json("Avatar é o mesmo ou inexistente ");
    }

    const { email, name, avatar_id } = await deliveryman.update(req.body);

    return res.json({ email, name, avatar_id });
  }

  async show(req, res) {
    const deliveryman = await Deliveryman.findOne({
      where: { id: req.params.id },
      attributes: ["id", "name", "email", "avatar_id"]
    });

    if (!deliveryman) {
      return res.status(400).json("User not found");
    }

    return res.json(deliveryman);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .positive()
        .integer()
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json("Validations fails");
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json("User not found");
    }
    await deliveryman.destroy();
    return res.send("");
  }
}

export default new DeliverymanController();
