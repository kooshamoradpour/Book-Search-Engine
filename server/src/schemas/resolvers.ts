import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../services/auth.js';
import  {User}  from '../models/index.js';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return await User.findById(user._id);
    },
  },

  Mutation: {
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });

      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = signToken(user.username, user.email, user.id);
      return { token, user };
    },

    addUser: async (_: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user.id);
      return { token, user };
    },

    saveBook: async (_: any, { book }: any, { user }: any) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      return await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { savedBooks: book } },
        { new: true }
      );
    },

    removeBook: async (_: any, { bookId }: any, { user }: any) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      return await User.findByIdAndUpdate(
        user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};
