import { Server } from 'socket.io';

let io;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    if (!io) {
      io = new Server(res.socket.server);

      io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('join', ({ name }) => {
          socket.emit('message', { name: 'System', message: `${name} joined the chat!` });
        });

        socket.on('sendMessage', ({ name, message, file }) => {
          if (file) {
            // هنا يمكن تخزين وتحميل الملفات (إذا كانت موجودة)
            socket.emit('message', { name, message, file: 'رابط الملف المرفوع' });
          } else {
            io.emit('message', { name, message });
          }
        });

        socket.on('createRoom', (roomId) => {
          socket.join(roomId);
          socket.emit('message', { name: 'System', message: `Room ${roomId} created.` });
        });
      });
    }
    res.end();
  }
}
