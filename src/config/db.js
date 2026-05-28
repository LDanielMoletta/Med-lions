const mongoose = require('mongoose');
const dns = require('dns').promises;

const buildFallbackUrl = async (srvUrl) => {
    const match = srvUrl.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)(\?.*)?$/);
    if (!match) {
        throw new Error('URL SRV inválida para fallback.');
    }

    const [, user, pass, host, dbName, query = ''] = match;
    const resolver = new dns.Resolver();
    resolver.setServers(['8.8.8.8', '8.8.4.4']);

    const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${host}`);
    const hosts = srvRecords.map(record => `${record.name}:${record.port}`);

    const params = new URLSearchParams(query.replace(/^\?/, ''));
    if (!params.has('authSource')) params.set('authSource', 'admin');
    if (!params.has('retryWrites')) params.set('retryWrites', 'true');
    if (!params.has('w')) params.set('w', 'majority');
    if (!params.has('tls')) params.set('tls', 'true');

    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hosts.join(',')}/${dbName}?${params.toString()}`;
};

const conectarBanco = async () => {
    const url = process.env.MONGODB_URI || 'mongodb+srv://login:senha@cluster0.dzxaibn.mongodb.net/medlions?retryWrites=true&w=majority';

    try {
        await mongoose.connect(url);
        console.log('🍃 MongoDB conectado com sucesso!');
        return;
    } catch (error) {
        if (url.startsWith('mongodb+srv://') && error.message.includes('querySrv')) {
            try {
                const fallbackUrl = await buildFallbackUrl(url);
                console.log('⚠️ Consulta SRV falhou, tentando fallback sem SRV.');
                await mongoose.connect(fallbackUrl);
                console.log('🍃 MongoDB conectado com sucesso via fallback sem SRV!');
                return;
            } catch (fallbackError) {
                console.error('❌ Falha no fallback sem SRV:', fallbackError.message);
            }
        }

        console.error('❌ Erro ao conectar ao MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = conectarBanco;