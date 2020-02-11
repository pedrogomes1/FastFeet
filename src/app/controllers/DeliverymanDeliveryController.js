import * as Yup from "yup";
import { Op } from "sequelize";
import Delivery from "../models/Delivery";
import Deliveryman from "../models/Deliveryman";

// Listar as encomendas do entregador específico

class DeliverymanDeliveryController {
  async index(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .positive()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json("Validations fails");
    }
    const delivery = await Delivery.findOne({
      where: { deliveryman_id: req.body.id }
    });

    if (!delivery) {
      return res.status(400).json("Deliveryman not found");
    }

    const { page = 1 } = req.query;

    const findDelivery = await Delivery.findAll({
      where: { canceled_at: null, end_date: null },
      attributes: ["recipient_id", "product", "start_date", "end_date"],
      limit: 20,
      offset: (page - 1) * 20, // Qnts registros eu quero pular
      include: [
        {
          model: Deliveryman,
          as: "deliveryman",
          where: { id: req.body.id },
          attributes: []
        }
      ]
    });

    return res.json(findDelivery);
  }

  // Listar encomendas já entregues
  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .positive()
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json("Validations fails");
    }
    const delivery = await Delivery.findOne({
      where: { deliveryman_id: req.params.id }
    });

    const { page = 1 } = req.query;

    if (!delivery) {
      return res.status(400).json("Deliveryman not found");
    }

    const findFinishedDelivery = await Delivery.findAll({
      where: { end_date: { [Op.ne]: null } },
      attributes: ["id", "product", "start_date", "end_date"],
      limit: 10,
      offset: (page - 1) * 20, // Qnts registros eu quero pular
      include: [
        {
          model: Deliveryman,
          as: "deliveryman",
          where: { id: req.params.id },
          attributes: []
        }
      ]
    });

    return res.json(findFinishedDelivery);
  }
}

export default new DeliverymanDeliveryController();
