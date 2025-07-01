const User = require("../models/User");
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '5h' }
    );
};

module.exports = {
    signup: async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({ error: 'E-mail e senha obrigatórios.' });
            }

            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ error: 'E-mail já cadastrado!' });
            }

            const newUser = new User({
                email,
                password
            });

            await newUser.save();

            const token = generateToken(newUser._id);

            res.status(201).json({
                message: 'Usuário criado com sucesso!',
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    createdAt: newUser.createdAt
                },
                token
            });
            
        } catch (error) {
            console.error('Erro ao criar usuário:', error);

            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({ 
                    error: 'Dados inválidos', 
                    details: errors 
                });
            }

            res.status(500).json({ 
                error: 'Erro interno do servidor.' 
            });
        }
    },

    signin: async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({ 
                    error: 'E-mail e senha são obrigatórios.' 
                });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            const token = generateToken(user._id);

            res.status(200).json({
                message: 'Login realizado com sucesso!',
                user: {
                    id: user._id,
                    email: user.email,
                    createdAt: user.createdAt
                },
                token
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ 
                error: 'Erro interno do servidor.' 
            });
        }
    },

    verifyToken: async (req, res, next) => {
        try {
            const authHeader = req.header('Authorization');

            if (!authHeader) {
                return res.status(401).json({ error: 'Token de acesso necessário' });
            }

            const token = authHeader.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({ error: 'Token de acesso necessário' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            req.user = user;
            req.token = token;
            next();

        } catch (error) {
            console.error('Erro na verificação do token:', error);
            
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Token inválido.' });
            }
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expirado.' });
            }

            res.status(401).json({ error: 'Token inválido.' });
        }
    }
};