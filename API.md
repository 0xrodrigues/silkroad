# 📡 API Documentation - Silk Road

Base URL: `http://localhost:3000/api`

## Autenticação

🚧 **Em desenvolvimento** - Atualmente a API não requer autenticação.

## Endpoints

### Health Check

#### GET `/health`

Verifica o status do servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-05T10:00:00.000Z"
}
```

---

## Products

### GET `/api/products`

Lista todos os produtos ativos com filtros opcionais.

**Query Parameters:**
- `search` (string, opcional) - Busca por título ou descrição
- `category` (string, opcional) - Filtra por categoria
- `currency` (integer, opcional) - Filtra por moeda (1=ETH, 2=BTC, 3=USDT, 4=BRL)

**Response:**
```json
[
  {
    "productId": "uuid-here",
    "title": "MacBook Pro M3",
    "description": "Laptop profissional Apple...",
    "price": 12999.99,
    "currency": "BRL",
    "category": "Eletrônicos",
    "images": ["https://..."],
    "tags": ["laptop", "apple"],
    "quantity": 5,
    "isDigital": false,
    "viewCount": 42,
    "soldCount": 3,
    "createdAt": "2024-11-05T10:00:00.000Z"
  }
]
```

**Exemplo:**
```bash
GET /api/products?search=macbook&category=Eletrônicos
```

---

### GET `/api/products/:id`

Busca um produto específico por ID (UUID).

**Path Parameters:**
- `id` (uuid, obrigatório) - ID do produto

**Response:**
```json
{
  "productId": "uuid-here",
  "title": "MacBook Pro M3",
  "description": "Laptop profissional Apple...",
  "price": 12999.99,
  "currency": "BRL",
  "category": "Eletrônicos",
  "images": ["https://..."],
  "tags": ["laptop", "apple"],
  "quantity": 5,
  "isDigital": false,
  "deliveryMethod": "PHYSICAL_SHIPPING",
  "estimatedDelivery": 7,
  "viewCount": 42,
  "soldCount": 3,
  "sellerId": "1",
  "status": "ACTIVE",
  "createdAt": "2024-11-05T10:00:00.000Z",
  "updatedAt": "2024-11-05T10:00:00.000Z"
}
```

**Errors:**
- `404` - Produto não encontrado

---

### POST `/api/products`

Cria um novo produto.

**Request Body:**
```json
{
  "title": "Curso de Node.js",
  "description": "Aprenda Node.js do zero...",
  "sellerId": 1,
  "price": 297.00,
  "currency": "BRL",
  "category": "Cursos Digitais",
  "tags": ["nodejs", "programação"],
  "images": ["https://..."],
  "quantity": 999,
  "isDigital": true,
  "deliveryMethod": null,
  "estimatedDelivery": null
}
```

**Required Fields:**
- `title` (string)
- `description` (string)
- `price` (number, > 0)

**Optional Fields:**
- `sellerId` (number)
- `currency` (string: "BRL", "USD", "EUR", "BTC", "ETH") - default: "BRL"
- `category` (string)
- `tags` (array of strings)
- `images` (array of URLs)
- `quantity` (number) - default: 1
- `isDigital` (boolean) - default: false
- `deliveryMethod` (number: 1=PHYSICAL_SHIPPING, 2=DIGITAL_LINK, 3=PICKUP)
- `estimatedDelivery` (number, dias)

**Response:**
```json
{
  "productId": "uuid-here",
  "title": "Curso de Node.js",
  "price": 297.00,
  "currency": "BRL",
  ...
}
```

**Status Codes:**
- `201` - Produto criado com sucesso
- `400` - Dados inválidos

---

### PATCH `/api/products/:id/view`

Incrementa o contador de visualizações do produto.

**Path Parameters:**
- `id` (uuid, obrigatório) - ID do produto

**Response:**
```json
{
  "viewCount": 43
}
```

**Errors:**
- `404` - Produto não encontrado

---

## Orders

### POST `/api/orders`

Cria um novo pedido.

**Request Body:**
```json
{
  "productId": "uuid-here",
  "buyerId": "uuid-here",
  "sellerId": "1",
  "quantity": 2,
  "price": 599.80,
  "paymentMethod": "PIX",
  "shippingAddress": "Rua Exemplo, 123 - São Paulo, SP",
  "notes": "Entregar no período da manhã"
}
```

**Required Fields:**
- `productId` (uuid)
- `buyerId` (uuid)
- `sellerId` (string)
- `quantity` (number, > 0)
- `price` (number, > 0)
- `paymentMethod` (string)

**Optional Fields:**
- `shippingAddress` (string)
- `notes` (string)

**Response:**
```json
{
  "orderId": "uuid-here",
  "productId": "uuid-here",
  "buyerId": "uuid-here",
  "sellerId": "1",
  "quantity": 2,
  "price": 599.80,
  "paymentMethod": "PIX",
  "shippingAddress": "Rua Exemplo, 123...",
  "notes": "Entregar no período da manhã",
  "status": "CREATED",
  "paymentStatus": "PENDING",
  "createdAt": "2024-11-05T10:00:00.000Z",
  "updatedAt": "2024-11-05T10:00:00.000Z"
}
```

**Status Codes:**
- `201` - Pedido criado com sucesso
- `400` - Dados inválidos

---

### GET `/api/orders/buyer/:buyerId`

Lista todos os pedidos de um comprador.

**Path Parameters:**
- `buyerId` (uuid, obrigatório) - ID do comprador

**Response:**
```json
[
  {
    "orderId": "uuid-here",
    "productId": "uuid-here",
    "quantity": 1,
    "price": 297.00,
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    "createdAt": "2024-11-05T10:00:00.000Z"
  }
]
```

---

### GET `/api/orders/seller/:sellerId`

Lista todos os pedidos de um vendedor.

**Path Parameters:**
- `sellerId` (string, obrigatório) - ID do vendedor

**Response:**
```json
[
  {
    "orderId": "uuid-here",
    "productId": "uuid-here",
    "buyerId": "uuid-here",
    "quantity": 1,
    "price": 297.00,
    "status": "SHIPPED",
    "paymentStatus": "PAID",
    "createdAt": "2024-11-05T10:00:00.000Z"
  }
]
```

---

### PUT `/api/orders/:orderId/status`

Atualiza o status de um pedido.

**Path Parameters:**
- `orderId` (uuid, obrigatório) - ID do pedido

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "paymentStatus": "PAID"
}
```

**Status Values:**
- Order Status: `CREATED`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- Payment Status: `PENDING`, `PAID`, `FAILED`, `REFUNDED`

**Response:**
```json
{
  "message": "Order status updated successfully.",
  "order": {
    "orderId": "uuid-here",
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    ...
  }
}
```

**Errors:**
- `400` - Dados inválidos
- `404` - Pedido não encontrado

---

## Error Responses

Todos os endpoints podem retornar erros no seguinte formato:

```json
{
  "error": "Mensagem de erro descritiva"
}
```

**Common Status Codes:**
- `400` - Bad Request (dados inválidos)
- `404` - Not Found (recurso não encontrado)
- `500` - Internal Server Error (erro do servidor)

---

## Data Types

### Currency Codes
- `BRL` - Real Brasileiro (código 4)
- `USD` - Dólar Americano
- `EUR` - Euro
- `BTC` - Bitcoin (código 2)
- `ETH` - Ethereum (código 1)
- `USDT` - Tether USD (código 3)

### Product Status
- `ACTIVE` (1) - Ativo e disponível
- `SOLD_OUT` (2) - Esgotado
- `DELETED` (3) - Deletado
- `PENDING_REVIEW` (4) - Aguardando revisão
- `ARCHIVED` (5) - Arquivado

### Delivery Methods
- `PHYSICAL_SHIPPING` (1) - Envio físico
- `DIGITAL_LINK` (2) - Link digital
- `PICKUP` (3) - Retirada local

---

## Rate Limiting

🚧 **Em desenvolvimento** - Atualmente não há limite de requisições.

## Versioning

Versão atual: `v1.0.0`

A API não possui versionamento na URL. Mudanças breaking serão comunicadas com antecedência.
