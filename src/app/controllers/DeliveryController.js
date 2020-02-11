import * as Yup from "yup";
import { format } from "date-fns";
import pt from "date-fns/locale/pt";
import Delivery from "../models/Delivery";
import Recipient from "../models/Recipient";
import Deliveryman from "../models/Deliveryman";
import Mail from "../../lib/mail";

class DeliveryController {
  async store(req, res) {
    // StartofHour = pega a hora quebrada e transforma em inteira
    // parseISO transforma a string de data em um objeto date do javascript
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validations fails" });
    }

    const recipient = await Recipient.findOne({
      where: { id: req.body.recipient_id }
    });

    if (!recipient) {
      return res.status(400).json("Recipient not found");
    }

    // Verificando se cadastrou um entregador que não existe
    const deliveryman = await Deliveryman.findOne({
      where: { id: req.body.deliveryman_id }
    });

    if (!deliveryman) {
      return res.status(400).json("Deliveryman not found");
    }

    const delivery = await Delivery.create(req.body);

    // Filtro no Delivery incluindo o nome e e-mail do entregador que foi cadastrado
    const newDelivery = await Delivery.findOne({
      where: {
        deliveryman_id: req.body.deliveryman_id,
        product: req.body.product
      },
      include: [
        {
          model: Deliveryman,
          as: "deliveryman",
          attributes: ["name", "email"]
        },
        {
          model: Recipient,
          as: "recipient",
          where: { id: req.body.recipient_id },
          attributes: ["street", "number", "complement", "state", "city", "cep"]
        }
      ]
    });

    console.log(newDelivery.createdAt);

    await Mail.sendMail({
      to: `${newDelivery.deliveryman.name} <${newDelivery.deliveryman.email}>`,
      subject: "Nova encomenda",
      template: "newDelivery",
      context: {
        deliveryman: newDelivery.deliveryman.name,
        product: newDelivery.product,
        date: format(
          newDelivery.createdAt,
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          { locale: pt }
        ),
        street: newDelivery.recipient.street,
        number: newDelivery.recipient.number,
        city: newDelivery.recipient.city,
        state: newDelivery.recipient.state,
        cep: newDelivery.recipient.cep,
        complement: newDelivery.recipient.complement
      }
    });
    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json("Validations fails");
    }

    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(401).json("Delivery not found");
    }

    const recipientId = await Recipient.findOne({
      where: { id: req.body.recipient_id }
    });

    if (!recipientId) {
      return res.status(400).json("Recipient not found");
    }

    const deliveryman = await Deliveryman.findOne({
      where: { id: req.body.deliveryman_id }
    });

    if (!deliveryman) {
      return res.status(400).json("Deliveryman not found");
    }

    // Primeiro verificar se O(um, unico .. n pode ser findAll) pedido pode ser atualizado, filtrar os disponíveis
    const newDelivery = await Delivery.findOne({
      where: {
        id: delivery.id,
        start_date: null,
        canceled_at: null
      }
    });
    // Se a entrega já haver uma start_date, end_date ou canceled_at cadastrada
    if (!newDelivery) {
      return res.status(400).json("Delivery already completed");
    }

    const { start_date } = req.body;

    const {
      product,
      recipient_id,
      deliveryman_id,
      end_date
    } = await delivery.update(req.body);

    return res.status(200).json({
      product,
      start_date,
      recipient_id,
      deliveryman_id,
      end_date
    });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .integer()
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json("Validations fails");
    }

    const delivery = await Delivery.findByPk(req.params.id);

    delivery.destroy();

    return res.status(200).json("");
  }

  async index(req, res) {
    const deliveryman = await Delivery.findAll({
      attributes: [
        "id",
        "recipient_id",
        "deliveryman_id",
        "product",
        "start_date",
        "end_date",
        "canceled_at"
      ]
    });

    return res.json(deliveryman);
  }
}

export default new DeliveryController();
