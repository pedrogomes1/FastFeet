import Sequelize, { Model } from "sequelize";

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        cep: Sequelize.STRING
      },
      { sequelize }
    );
    return this;
  }
}

export default Recipient;