import * as Yup from "yup";
import pt, {
  format,
  startOfHour,
  startOfDay,
  endOfDay,
  parseISO,
  isBefore
} from "date-fns";
import { Op } from "sequelize";
import Delivery from "../models/Delivery";
import Deliveryman from "../models/Deliveryman";
// Esse controller fica responsável para cadastrar a data de inicio
// assim que for feita a retirada do produto pelo entregador
// e as retiradas só podem ser feitas entre as 08:00 e 18:00h.

// Routes -> 1° Pedido , 2º Usuário

class DeliveryStartController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json("Validations fails");
    }

    // Verificar se existe Entregador
    const deliveryman = await Deliveryman.findByPk(req.params.idDeliveryman);
    if (!deliveryman) {
      return res.status(400).json("Entregador não existe");
    }

    // Verificar se a encomenda existe
    const delivery = await Delivery.findByPk(req.params.idDelivery);
    if (!delivery) {
      return res.status(400).json("Encomenda não existe");
    }

    // Verificar se o pedido já foi cancelado
    if (delivery.canceled_at) {
      // Verificar se o pedido já está cancelado
      return res.status(400).json("O pedido já foi cancelado");
    }
    // Verificar se o pedido já foi startado
    if (delivery.start_date) {
      return res.status(400).json("Já foi cadastrado o início deste pedido");
    }
    // Verificar se o pedido já foi finalizado
    if (delivery.end_date) {
      return res.status(400).json("O pedido já foi entregue");
    }

    // Verificar se a encomenda que vai ser atualizada pertence ao entregador correto
    const isBelongingOrder = await Delivery.findByPk(req.params.idDelivery, {
      include: [
        {
          model: Deliveryman,
          as: "deliveryman",
          where: { id: req.params.idDeliveryman }
        }
      ]
    });

    if (!isBelongingOrder) {
      return res.json("A encomenda não pertence ao entregador");
    }

    const { start_date } = req.body;

    const hourStart = startOfHour(parseISO(start_date));
    const currentTime = hourStart.getHours();

    if (isBefore(hourStart, new Date())) {
      return res
        .status(401)
        .json(
          "Order pickup time not allowed, only allowed between 8am and 18pm"
        );
    }

    if (!(currentTime >= 8 && currentTime <= 18)) {
      return res
        .status(400)
        .json(
          "Order pickup time not allowed, only allowed between 8am and 18pm"
        );
    }
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'", // dia 02 de junho as 8hrs`
      { locale: pt }
    );

    // Verificando se o entregador tem mais de 5 retiradas por dia
    const withdrawalLimit = await Delivery.count({
      where: {
        deliveryman_id: req.params.idDeliveryman,
        end_date: { [Op.ne]: null }
      }
    });
    console.log(withdrawalLimit);

    if (withdrawalLimit >= 5) {
      return res.status(400).json("O limite são de 5 retiradas por dia");
    }
    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
      canceled_at,
      end_date
    } = await delivery.update({ start_date });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
      canceled_at,
      end_date,
      start_date: formattedDate
    });
  }
}

export default new DeliveryStartController();
