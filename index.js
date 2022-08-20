/* Copyright (C) 2020 INrlTeam.

Licensed under the  GPL-3.0 License;

you may not use this file except in compliance with the License.

inrl-md

*/

const os = require("os");
const fs = require("fs");
const path = require("path");
const events = require("./lib/inrl");
const chalk = require('chalk');
const config = require('./config');
const simpleGit = require('simple-git');
const {makeWASocket, MessageType, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, Mimetype,useSingleFileAuthState, makeInMemoryStore, Presence} = require('@adiwajshing/baileys');
const {Message, Image, Video} = require('./lib/');
const { DataTypes } = require('sequelize');
const { GreetingsDB, getMessage } = require("./lib/sql/greetings");
const got = require('got');
const git = simpleGit();
const axios = require('axios');


// Sql
const bot = config.DATABASE.define('bot', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./lib/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./lib/sql/' + plugin);
    }
});

const plugindb = require('./lib/sql/plugin');

// Yalnızca bir kolaylık. https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function //
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
   });
};
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
setTimeout(() => {    

const { state, saveState } = useSingleFileAuthState('./session.json')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

async function whatsappBot () {
    
    let { version, isLatest } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({

        logger: pino({ level: 'silent' }),

        printQRInTerminal: false,

        auth: state,

        version

    })

    store.bind(sock.ev)
    
    console.log(
            chalk.green.bold('✅ Login successful!')
        );

        console.log(
            chalk.blueBright.italic('⬇️ Installing external plugins...')
        );
        
sock.ev.on('messages.upsert', async (m) => {

        if (!m.hasNewMessage) return;
        if (!m.messages && !m.count) return;
        let msg = m.messages.all()[0];
        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;

var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });

        console.log(
            chalk.blueBright.italic('⬇️  Installing plugins...')
        );

        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });

        console.log(
            chalk.blueBright.italic('✅ Plugins Installed...')
        );


        console.log(
            chalk.green.bold('✅ inrl-Bot working!')
        );

        
        if (msg.messageStubType === 32 || msg.messageStubType === 28) {
        var plk_say = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
        const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var plk_here = new Date().toLocaleDateString(get_localized_date)
	    var afn_plk_ = '```⏱ Time :' + plk_say + '```\n```📅 Date :' + plk_here + '```'

            var gb = await getMessage(msg.key.remoteJid, 'goodbye');
            if (gb !== false) {
                if (gb.message.includes('{pp}')) {
                let pp 
                try { pp = await sock.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await sock.getProfilePicture(); }
                    var pinkjson = await sock.groupMetadata(msg.key.remoteJid)
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                await sock.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message.replace('{pp}', '').replace('{mention}', '@' + msg.messageStubParameters[0].split('@')[0]).replace('{subject}', pinkjson.subject).replace('{time}', afn_plk_).replace('{maker}', pinkjson.owner).replace('{desc}', pinkjson.desc).replace('{owner}', sock.user.name) }); });                           
            } else if (gb.message.includes('{gif}')) {
                //created by afnanplk
                    var plkpinky = await axios.get(config.GIF_BYE, { responseType: 'arraybuffer' })
                    var pinkjson = await sock.groupMetadata(msg.key.remoteJid)
                await sock.sendMessage(msg.key.remoteJid, Buffer.from(plkpinky.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message.replace('{gif}', '').replace('{mention}', '@' + msg.messageStubParameters[0].split('@')[0]).replace('{time}', afn_plk_).replace('{subject}', pinkjson.subject).replace('{maker}', pinkjson.owner).replace('{desc}', pinkjson.desc).replace('{owner}', sock.user.name) });
            } else {
                   await sock.sendMessage(msg.key.remoteJid,gb.message.replace('{subject}', pinkjson.subject).replace('{mention}', '@' + msg.messageStubParameters[0].split('@')[0]).replace('{maker}', pinkjson.owner).replace('{time}', afn_plk_).replace('{desc}', pinkjson.desc).replace('{owner}', sock.user.name), MessageType.text);
              } 
            }//thanks to farhan      
            return;
        } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
            // welcome
            var plk_say = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
           const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
           var plk_here = new Date().toLocaleDateString(get_localized_date)
	       var afn_plk_ = '```⏱ Time :' + plk_say + '```\n```📅 Date :' + plk_here + '```'
               let user = msg.messageStubParameters[0]
             var gb = await getMessage(msg.key.remoteJid);
            if (gb !== false) {
                if (gb.message.includes('{pp}')) {
                let pp
                try { pp = await sock.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await sock.getProfilePicture(); }
                    var pinkjson = await sock.groupMetadata(msg.key.remoteJid)
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                    //created by afnanplk
                await sock.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message.replace('{pp}', '').replace('{mention}', '@' + user.split('@')[0]).replace('{time}', afn_plk_).replace('{subject}', pinkjson.subject).replace('{maker}', pinkjson.owner).replace('{desc}', pinkjson.desc).replace('{owner}', sock.user.name) }); });                           
            } else if (gb.message.includes('{gif}')) {
                var plkpinky = await axios.get(config.WEL_GIF, { responseType: 'arraybuffer' })
                var pinkjson = await sock.groupMetadata(msg.key.remoteJid)
                await sock.sendMessage(msg.key.remoteJid, Buffer.from(plkpinky.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message.replace('{gif}', '').replace('{mention}', '@' + user.split('@')[0]).replace('{time}', afn_plk_).replace('{subject}', pinkjson.subject).replace('{maker}', pinkjson.owner).replace('{desc}', pinkjson.desc).replace('{owner}', sock.user.name) });
            } else {
                var pinkjson = await sock.groupMetadata(msg.key.remoteJid)
                   await sock.sendMessage(msg.key.remoteJid,gb.message.replace('{subject}', pinkjson.subject).replace('{mention}', '@' + user.split('@')[0]).replace('{maker}', pinkjson.owner).replace('{desc}', pinkjson.desc).replace('{time}', afn_plk_).replace('{owner}', sock.user.name), MessageType.text);
            }
          }         
            return;                               
    }         

        events.commands.map(
            async (command) =>  {
                if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                } else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }

                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && msg.message && msg.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 
                    (command.on !== undefined && command.on === 'text' && text_msg) ||
                    // Video
                    (command.on !== undefined && (command.on === 'video')
                    && msg.message && msg.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg))))) {

                    let sendMsg = false;
                    var chat = sock.chats.get(msg.key.remoteJid)
                        
                    if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
                    
                    
                        
                        var match = text_msg.match(command.pattern);
                        
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && msg.message.imageMessage !== null) {
                            whats = new Image(sock, msg);
                        } else if (command.on !== undefined && (command.on === 'video' )
                        && msg.message.videoMessage !== null) {
                            whats = new Video(sock, msg);
                        } else {
                            whats = new Message(sock, msg);
                        }
/*
                        if (command.deleteCommand && msg.key.fromMe) {
                            await whats.delete(); 
                        }
*/
                        try {
                            await command.function(whats, match);
                        } catch (error) {
                             
                                await sock.sendMessage(sock.user.jid, '__inrlbot_☠☠_[bug] ' +
                                    '\n\n*🥶❣️ ' + error + '*\n'
                                    , MessageType.text);
                            }
                        }
                    }
                }
            }
        )
    });
  whatsappBot ()
}, 5000);
    
    let file = require.resolve(__filename)

fs.watchFile(file, () => {

	fs.unwatchFile(file)

	console.log(chalk.redBright(`Update ${__filename}`))

	delete require.cache[file]

	require(file)

})
