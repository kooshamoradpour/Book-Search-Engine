import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import db from './config/connection.js';
import { resolvers } from './schemas/resolvers.js';
import { typeDefs } from './schemas/typeDefs.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { authenticateToken } from './services/auth.js';
import { expressMiddleware } from '@apollo/server/express4';

dotenv.config();

const app = express(); // ✅ Use lowercase `app`
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  await server.start();
  // server.applyMiddleware({ app }); // ✅ Correctly passing `app` here

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];
        const user = authenticateToken(token);
        return { user };
      }
    }),
  );

  // Serve static files in production
  app.use(express.static(path.join(process.cwd(), '../client/dist')));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(process.cwd(), '../client/dist/index.html'));
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Server running on http://localhost:${PORT}/graphql`);
    });
  });
}

startApolloServer();

