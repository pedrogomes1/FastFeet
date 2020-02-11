import Delivery from "../models/Delivery";
import File from "../models/File";
import Deliveryman from "../models/Deliveryman";

// Routes -> 1° Pedido , 2º Usuário
class DeliveryFinishController {
  async update(req, res) {
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
    if (!delivery.start_date) {
      return res.status(400).json("Não foi cadastrado o início do pedido");
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
      return res
        .status(400)
        .json("A encomenda não pertence ao entregador solicitado");
    }

    const { originalname: name, filename: path } = req.file;
    const file = await File.create({ name, path });

    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
      start_date,
      end_date
    } = await delivery.update({ end_date: new Date(), signature_id: file.id });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
      start_date,
      end_date
    });
  }
}

export default new DeliveryFinishController();
