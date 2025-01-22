const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10); // Gera um salt único para a senha.
    const hashPassword = await bcrypt.hash(password, salt); // Gera o hash da senha usando o salt.

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, jwt_secret, { expiresIn: "1h" });

    res.status(201).json({ message: 'User created successfully', token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userUpdate = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: userUpdate,
    });

    res.status(200).json(user);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(400).json({ message: 'User does not exist' });
    }
    res.status(400).json({ message: error.message });
  }
};

exports.deletedUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(400).json({ message: 'User does not exist' });
    }
    res.status(400).json({ message: error.message });
  }
};

exports.deletedUserAll = async (req, res) => {
  try {
    await prisma.user.deleteMany();
    res.status(200).json({ message: 'All users have been deleted.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
