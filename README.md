<p align="center">
<img src="https://user-images.githubusercontent.com/45200253/74463962-74702900-4e71-11ea-928d-7885e28fcc11.png">
</p>

<h1 align="center"> Desafio 3 - FastFeet	</h1>

<h3 align="center"> :rocket: Etapa 2/4 do Desafio Final :rocket:	</h3>

<p>Esse desafio consiste desenvolver uma aplicação para gestão de uma transportadora fictícia, FastFeet. Dentre as funcionalidades estão: cadastro, listagem , edição e remoção de entregadores, encomendas e destinatários. Também é feito validações de datas, cadastro de imagens, autenticação no sistema e envio de e-mails. </p>

<h3>Ferramentas utilizadas: </h3>

* Express
* Sucrase + Nodemon;
* Sequelize (Utilizando o banco PostgreSQL);
* Jsonwebtoken;
* Bcryptjs;
* Yup;
* Multer
* Date-fns
* Nodemailer

<h3>Inicializar API </h3>

```
git clone https://github.com/PedroGomes1/FastFeet.git
cd backend
yarn
yarn dev
``` 

<h3>ENV</h3>

Trocar as variáveis de ambiente (env.example) para suas respectivas configurações se necessário.


<h3>Envio de e-mails</h3>

É feito durante a aplicação o envio de e-mails utilizando a ferramenta [mailtrap](http://mailtrap.io/) para avisar aos entregadores quando uma nova encomenda é cadastrada e também quando há algum cancelamento solicitado, ou seja, quando o campo da encomenda canceled_at é alterado.

<h3>Autenticação</h3>

A autenticação do sistema é feito através do uso do jsonwebtoken, o JWT. Quando um usuário faz o login no sistema através da rota Session, é gerado um token através da api com seu respectivo id.

<h3>Rotas</h3>
Segue abaixo todas as rotas da aplicação:

<h4> * Session (/sessions)</h4>

| Path       | Method | Params(JSON)        | Header |
| ---------- | ------ | ------------------- | ------ |
| /sessions  | POST   | {email, password}   | {isAdmin}    |


<h4>* Deliverymans (entregadores) (/deliveryman)</h4>

| Path             | Methods | Params(JSON) / Body     | Header |
| ---------------- | ------- | ----------------------- | ------ |
| /deliveryman     | POST    | {/}                     | JWT    |
| /deliveryman     | GET     | {/}                     | JWT    |
| /deliveryman/:id | PUT     | {email, name, avatar}   | JWT    |
| /deliveryman/:id | GET     | {id}                    | JWT    |
| /deliveryman/:id | DELETE  | {id}                    | JWT    |


<h4>* Delivery (encomendas) (/delivery)</h4>


| Path             | Methods | Params(JSON) / Body                                                                 | Header |     |
| ---------------- | ------- | ----------------------------------------------------------------------------------- | ------ | --- |
| /delivery        | POST    | {recipient_id, deliveryman_id, product }                                            | JWT    |     |
| /deliveryman     | GET     | {/}                                                                                 | JWT    |     |
| /deliveryman/:id | PUT     | {recipient_id, deliveryman_id, product, start_date, end_date, signature_id}         | JWT    |     |
| /deliveryman/:id | DELETE  | {id}                                                                                | JWT    |     |

<h4>* Recipient (destinatários) (/recipient)</h4>

| Path           | Methods | Params(JSON) / Body                              | Header |
| -------------- | ------- | ------------------------------------------------ | ------ |
| /recipient     | POST    | {street, number, complement, state, city, cep}   | JWT    |
| /recipient     | GET     | {/}                                              | JWT    |
| /recipient/:id | GET     | {id}                                             | JWT    |
| /recipient/:id | PUT     | {street, number, complement, state, city, cep}   | JWT    |
| /recipient:id  | DELETE  | {id}                                             | JWT    |

<h4>* Files (imagens) (/files)</h4>

| Path   | Methods | Params(JSON) / Body | Header |
| ------ | ------- | ------------------- | ------ |
| /files | POST    | {file}              | JWT    |

<h4>* Start Delivery (inicio da encomenda)</h4>

| Path                                       | Methods | Params(JSON) / Body           | Header |
| ------------------------------------------ | ------- | ----------------------------- | ------ |
| /delivery/:idDelivery/:idDeliveryman/start | PUT     | {idDelivery, idDeliveryman}   | JWT    |

<h4>* Finish Delivery (entrega da encomenda)</h4>

| Path                                        | Methods | Params(JSON) / Body                      | Header |
| ------------------------------------------- | ------- | ---------------------------------------- | ------ |
| /delivery/:idDelivery/:idDeliveryman/finished | PUT     | {idDelivery, idDeliveryman} / {file}     | JWT    |


<h4>* DeliverymanDelivery (encomenda de cada entregador)</h4>

| Path          | Methods | Params(JSON) / Body | Header |
| ------------- | ------- | ------------------- | ------ |
| /listdelivery | GET     | {/}                 | {/}    |

<h4>* DeliverymanDelivery (encomenda já finalizadas pelo entregador)</h4>

| Path                       | Methods | Params(JSON) / Body | Header |
| -------------------------- | ------- | ------------------- | ------ |
| /listdelivery/:id/finished | GET     | {id}                | {/}    |

<h4>* DeliveryProblems (problemas e cancelamento de encomendas)</h4>

| Path                         | Methods | Params(JSON) / Body | Header |
| ---------------------------- | ------- | ------------------- | ------ |
| /delivery/:id/problems       | POST    | {id}                | JWT    |
| /delivery/:id/problems       | GET     | {id}                | JWT    |
| /problem/:id/cancel-delivery | DELETE  | {id}                | JWT    |

## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

Produzido por Pedro Gomes :wave:
