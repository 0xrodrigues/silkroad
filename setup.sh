#!/bin/bash

echo "🛣️  Silk Road - Setup Inicial"
echo "================================"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+ primeiro."
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Verificar se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL não encontrado. Certifique-se de que está instalado e rodando."
else
    echo "✅ PostgreSQL encontrado"
fi

echo ""
echo "📦 Instalando dependências..."
npm install

echo ""
echo "📝 Configurando ambiente..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Arquivo .env criado. Por favor, configure suas variáveis de ambiente."
    echo ""
    echo "Edite o arquivo .env com suas configurações do PostgreSQL:"
    echo "  - DB_HOST"
    echo "  - DB_PORT"
    echo "  - DB_NAME"
    echo "  - DB_USER"
    echo "  - DB_PASSWORD"
    echo ""
else
    echo "⚠️  Arquivo .env já existe. Pulando..."
fi

echo ""
echo "🗄️  Para executar as migrations do banco de dados, rode:"
echo "  npm run db:migrate"
echo ""
echo "🚀 Para iniciar a aplicação em modo desenvolvimento:"
echo "  npm run dev"
echo ""
echo "✨ Setup concluído!"
