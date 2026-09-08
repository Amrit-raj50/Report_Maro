// config/socket.js
//
// Wires up Socket.io. Added because problem.controller.js, project.controller.js
// and internal.controller.js already call `req.app.get('io')` and `.emit(...)`
// on rooms like 'admins', `university_${id}`, and 'industry' — but nothing
// ever created an `io` instance or set it on the app, so those emits were
// silently no-ops. This file is purely additive: it doesn't change what any
// controller does, it just makes the io instance they already expect actually
// exist and authenticates/room-routes each connection.
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

function initSocket(httpServer, app) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  // Same JWT used by middleware/auth.middleware.js — a socket connects with
  // `auth: { token }` instead of an Authorization header.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Missing auth token'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, email, role }
      next();
    } catch (error) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const { id, role } = socket.user;

    // Room names match exactly what the controllers already emit to.
    if (role === 'admin') socket.join('admins');
    if (role === 'industry') socket.join('industry');
    if (role === 'university') socket.join(`university_${id}`);

    console.log(`🔌 Socket connected: user=${id} role=${role}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: user=${id}`);
    });
  });

  // This is the line every controller's `req.app.get('io')` was waiting on.
  app.set('io', io);

  return io;
}

module.exports = { initSocket };
