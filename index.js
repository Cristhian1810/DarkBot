const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    });

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            console.log('\x1b[31m%s\x1b[0m', 'Bot Desconectado');
            if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('\x1b[32m%s\x1b[0m', 'Conectado a DarkBot');
        }
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async (msg) => {
        const content = msg.messages[0]?.message?.conversation?.toLowerCase() || '';  // Asegura que 'content' sea una cadena vacía si no hay mensaje

        // Mensajes
        if (content === '.hola') {
            await sock.sendMessage(msg.messages[0].key.remoteJid, { text: 'Mundo' });
        }
    });
}

connectToWhatsApp();

