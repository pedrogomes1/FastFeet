import * as Yup from "yup";
import { format } from "date-fns";
import pt from "date-fns/locale/pt";
import Mail from "../../lib/mail";
import Delivery from "../models/Delivery";
import DeliveryMan from "../models/Deliveryman";
import DeliveryProblem from "../models/DeliveryProblems";

class DeliveryProblems {
  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .required(),
      description: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json("Validations fails");
    }

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json("Delivery not found");
    }

    const { description } = req.body;

    const deliveryProblems = await DeliveryProblem.create({
      delivery_id: delivery.id,
      description
    });

    return res.json(deliveryProblems);
  }

  async index(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .required()
        .integer()
    });
    if (!(await schema.isValid(req.params))) {
      return res.status(400).json("Validations fails");
    }
    const { id } = req.params;
    const deliveryProblem = await DeliveryProblem.findAll({
      where: { delivery_id: id }
    });

    return res.json(deliveryProblem);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .required()
        .integer()
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json("Validations fails");
    }
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.json("Delivery not found");
    }

    // Atualizar o status de canceled do delivery
    if (!(delivery.canceled_at == null)) {
      return res.status(400).json("O pedido já está cancelado");
    }

    await delivery.update(
      { canceled_at: new Date() },
      { where: { id: delivery.id } }
    );

    const deliveryman = await DeliveryMan.findOne({
      where: { id: delivery.deliveryman_id },
      attributes: ["name", "email"]
    });

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: "Cancelamento de encomenda",
      template: "cancellation",
      context: {
        deliveryman: deliveryman.name,
        idPedido: delivery.id,
        product: delivery.product,
        date: format(delivery.canceled_at, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt
        })
      }
    });

    return res.json("");
  }
}

export default new DeliveryProblems();
