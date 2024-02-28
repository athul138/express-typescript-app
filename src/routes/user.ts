const  express = require('express');
// import { createItem, getItems, updateItem, deleteItem } from '../controllers/itemController';
import { createUser, getUsers, updateUser, deleteUser , login} from '../controllers/userController';

const router = express.Router();

router.post('/', createUser);
router.post('/login', login);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;