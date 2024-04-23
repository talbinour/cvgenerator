const UserInfo = require('./userDetails');
const bcrypt = require('bcrypt');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null,file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: fileFilter
});


class UserController {
    static async createUser(req, res) {
        try {
            const { username, password, profile, email ,photo } = req.body;
            const existingUser = await UserInfo.findOne({ username });
            if (existingUser) {
                return res.status(400).send({ error: "Username already exists" });
            }
            const existingEmail = await UserInfo.findOne({ email });
            if (existingEmail) {
                return res.status(400).send({ error: "Email already exists" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserInfo({
                username,
                mot_passe: hashedPassword,
                profile: profile || '',
                email
            });
            await newUser.save();
            res.status(201).send({ msg: "User created successfully" });
        } catch (error) {
            res.status(500).send({ error: "Internal server error" });
        }
    }

    static async updateUserPhoto(req, res) {
        try {
            const userId = req.params.userId;
            const user = await UserInfo.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            user.photo = req.file.path;
            await user.save();
            res.status(200).json({ msg: 'Profile photo updated successfully', userPhotoUrl: `${req.file.path}?${new Date().getTime()}` });
        } catch (error) {
            console.error('Error updating user photo:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateUser(req, res) {
        try {
            const userId = req.params.userId;
            const { nom, prenom, Nbphone, email, date_naissance, pays, photo } = req.body;
            let updatedUser;
            if (req.file) {
                updatedUser = await UserInfo.findByIdAndUpdate(userId, { nom, prenom, Nbphone, email, date_naissance, pays, photo: req.file.path }, { new: true });
            } else {
                updatedUser = await UserInfo.findByIdAndUpdate(userId, { nom, prenom, Nbphone, email, date_naissance, pays, photo }, { new: true });
            }
            res.status(200).json({ user: updatedUser });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async deleteUser(req, res) {
        try {
            const userId = req.params.userId;
            await UserInfo.findByIdAndDelete(userId);
            return res.status(200).send({ msg: "User deleted successfully" });
        } catch (error) {
            return res.status(500).send({ error: "Internal server error" });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserInfo.find({}, { mot_passe: 0 });
            return res.status(200).send(users);
        } catch (error) {
            return res.status(500).send({ error: "Internal server error" });
        }
    }

    static async deleteAttribute(req, res) {
        try {
            const userId = req.params.userId;
            const attributeToDelete = req.body.attribute;
            const updatedUser = await UserInfo.findByIdAndUpdate(userId, { $unset: { [attributeToDelete]: 1 } }, { new: true });
            if (updatedUser) {
                return res.status(200).send({ msg: `${attributeToDelete} deleted successfully`, user: updatedUser });
            } else {
                return res.status(404).send({ error: "User not found" });
            }
        } catch (error) {
            return res.status(500).send({ error: "Internal server error" });
        }
    }

    static async getUserById(req, res) {
        try {
            const { id } = req.params;
    
            if (!id) {
                return res.status(400).json({ error: "ID parameter is required" });
            }
    
            // Récupérer l'utilisateur avec l'ID spécifié, y compris le champ 'photo'
            const user = await UserInfo.findById(id, { mot_passe: 0, photo: 1 });
    
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
    
            return res.status(200).json(user);
        } catch (error) {
            console.error("Error retrieving user:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    

    static async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            if (!email) {
                return res.status(400).json({ error: "Email parameter is required" });
            }
            const user = await UserInfo.findOne({ email }, { mot_passe: 0 });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error("Error retrieving user:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    // Ajoutez ici d'autres méthodes du contrôleur si nécessaire
    // Par exemple, des méthodes pour la gestion d'autres fonctionnalités liées aux utilisateurs
}

module.exports = UserController;
