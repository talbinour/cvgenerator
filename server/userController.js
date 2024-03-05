const UserInfo = require('./userDetails');
const bcrypt = require('bcrypt');

class UserController {
    static async createUser(req, res) {
        try {
            const { username, password, profile, email } = req.body;

            // Vérifier l'existence de l'utilisateur
            const existingUser = await UserInfo.findOne({ username });
            if (existingUser) {
                return res.status(400).send({ error: "Username already exists" });
            }

            // Vérifier l'existence de l'email
            const existingEmail = await UserInfo.findOne({ email });
            if (existingEmail) {
                return res.status(400).send({ error: "Email already exists" });
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Créer un nouvel utilisateur
            const newUser = new UserInfo({
                username,
                mot_passe: hashedPassword,
                profile: profile || '',
                email
            });

            // Sauvegarder l'utilisateur dans la base de données
            await newUser.save();

            res.status(201).send({ msg: "User created successfully" });
        } catch (error) {
            res.status(500).send({ error: "Internal server error" });
        }
    }

    static async updateUser(req, res) {
        try {
          const userId = req.params.userId;
          const { nom, prenom, Nbphone, email, date_naissance } = req.body;
      
          let updatedUser;
      
          if (req.file) {
            // Si une nouvelle image est téléchargée, mettez à jour également l'image
            updatedUser = await UserInfo.findByIdAndUpdate(
              userId,
              { nom, prenom, Nbphone, email, date_naissance, photo: req.file.path },
              { new: true } // Renvoie le nouvel utilisateur mis à jour
            );
          } else {
            // Si aucune nouvelle image n'est téléchargée, mettez à jour les autres informations
            updatedUser = await UserInfo.findByIdAndUpdate(
              userId,
              { nom, prenom, Nbphone, email, date_naissance },
              { new: true } // Renvoie le nouvel utilisateur mis à jour
            );
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
    
            // Supprimer l'utilisateur de la base de données
            await UserInfo.findByIdAndDelete(userId);
    
            return res.status(200).send({ msg: "User deleted successfully" });
        } catch (error) {
            return res.status(500).send({ error: "Internal server error" });
        }
    }
    

    static async getAllUsers(req, res) {
        try {
            // Récupérer tous les utilisateurs de la base de données
            const users = await UserInfo.find({}, { mot_passe: 0 });

            return res.status(200).send(users);
        } catch (error) {
            return res.status(500).send({ error: "Internal server error" });
        }
    }
    static async deleteAttribute(req, res) {
        try {
            const userId = req.params.userId; // Extraire l'ID de l'URL
            const attributeToDelete = req.body.attribute; // Attribut à supprimer du corps de la requête
    
            // Utiliser $unset pour supprimer l'attribut
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
    
            // Récupérer l'utilisateur avec l'ID spécifié
            const user = await UserInfo.findById(id, { mot_passe: 0 });
    
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
    
            // Récupérer l'utilisateur avec l'adresse e-mail spécifiée
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